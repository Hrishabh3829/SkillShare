import { Project } from "../models/project.model.js";
import { Request } from "../models/request.model.js";
import { User } from "../models/user.model.js";

// Create a new project
export const userNeed = async (req, res) => {
    try {
        const { title, description, requiredSkills, status, maxMembers } = req.body;
        const userId = req.id;

        if (!title || !description || !requiredSkills) {
            return res.status(400).json({
                message: "Title, description and required skills are mandatory",
                success: false
            });
        }

        // Validate skills array
        const skillsArray = requiredSkills.split(",").map(skill => skill.trim());
        if (skillsArray.length === 0 || skillsArray.length > 10) {
            return res.status(400).json({
                message: "Project must have between 1 and 10 required skills",
                success: false
            });
        }

        const duplicateTitle = await Project.findOne({ title });
        if (duplicateTitle) {
            return res.status(400).json({
                message: "Project with this title already exists",
                success: false
            });
        }

        // Create project with creator as the only initial member
        const project = await Project.create({
            title,
            description,
            requiredSkills: skillsArray,
            status: status || 'open',
            members: [userId],
            createdBy: userId,
            maxMembers: maxMembers || 5
        });

        const populatedProject = await Project.findById(project._id)
            .populate('createdBy', 'fullname email')
            .populate('members', 'fullname email skills');

        return res.status(201).json({
            message: "Project created successfully",
            project: populatedProject,
            success: true
        });
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message,
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all projects with optional filtering
export const getAllProjects = async (req, res) => {
    try {
        const { status, skills } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        if (skills) {
            const skillArray = skills.split(',');
            query.requiredSkills = { $in: skillArray };
        }

        // Get all projects except those created by the current user
        const projects = await Project.find(query)
            .populate('createdBy', 'fullname email')
            .populate('members', 'fullname email skills')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get projects created by the current user
export const getMyProjects = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select('fullname email');

        const projects = await Project.find({ createdBy: userId })
            .select('title description requiredSkills status createdAt')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Your projects fetched successfully",
            creator: user,
            projects,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get projects where user is a member
export const getJoinedProjects = async (req, res) => {
    try {
        const userId = req.id;

        const projects = await Project.find({ 
            members: userId,
            createdBy: { $ne: userId } // Exclude projects created by the user
        })
        .populate('createdBy', 'fullname email')
        .populate('members', 'fullname email skills')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Joined projects fetched successfully",
            projects,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Request to join a project
export const requestToJoin = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { message } = req.body;
        const userId = req.id;

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }

        // Check if project is full
        if (project.isFull) {
            return res.status(400).json({
                message: "Project has reached maximum member limit",
                success: false
            });
        }

        // Check if user is trying to join their own project
        if (project.createdBy.toString() === userId) {
            return res.status(400).json({
                message: "You cannot join your own project",
                success: false
            });
        }

        // Check if project is open
        if (project.status !== 'open') {
            return res.status(400).json({
                message: "Project is not accepting new members",
                success: false
            });
        }

        // Check if user is already a member
        if (project.members.includes(userId)) {
            return res.status(400).json({
                message: "You are already a member of this project",
                success: false
            });
        }

        // Create join request
        const request = await Request.create({
            project: projectId,
            requester: userId,
            message,
            status: 'pending'
        });

        // Populate the request with project and requester details
        const populatedRequest = await Request.findById(request._id)
            .populate('project', 'title description requiredSkills status')
            .populate('requester', 'fullname email skills');

        return res.status(201).json({
            message: "Join request sent successfully",
            request: populatedRequest,
            success: true
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already requested to join this project",
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Handle join request (accept/reject)
export const handleJoinRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action, responseMessage } = req.body;
        const userId = req.id;

        const request = await Request.findById(requestId)
            .populate('project');

        if (!request) {
            return res.status(404).json({
                message: "Request not found",
                success: false
            });
        }

        // Check if user is project creator
        if (request.project.createdBy.toString() !== userId) {
            return res.status(403).json({
                message: "Only project creator can handle join requests",
                success: false
            });
        }

        // Check if request is already handled
        if (request.status !== 'pending') {
            return res.status(400).json({
                message: "This request has already been handled",
                success: false
            });
        }

        if (action === 'accept') {
            // Check if project is full
            if (request.project.isFull) {
                return res.status(400).json({
                    message: "Project has reached maximum member limit",
                    success: false
                });
            }

            // Add user to project members
            await Project.findByIdAndUpdate(
                request.project._id,
                { $addToSet: { members: request.requester } }
            );
            request.status = 'accepted';
        } else if (action === 'reject') {
            request.status = 'rejected';
        } else {
            return res.status(400).json({
                message: "Invalid action",
                success: false
            });
        }

        request.responseMessage = responseMessage;
        await request.save();

        return res.status(200).json({
            message: `Request ${action}ed successfully`,
            request,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get projects matching user's skills
export const getMatchingProjects = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const projects = await Project.find({
            status: 'open',
            requiredSkills: { $in: user.skills },
            members: { $ne: userId }, // Exclude projects user is already a member of
            createdBy: { $ne: userId } // Exclude projects created by the user
        })
        .populate('createdBy', 'fullname email')
        .populate('members', 'fullname email skills')
        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Matching projects fetched successfully",
            projects,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};