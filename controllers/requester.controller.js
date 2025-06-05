import { Request } from "../models/request.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

// Get all join requests for a project
export const getProjectRequests = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.id;

        // Check if project exists and user is the creator
        const project = await Project.findOne({ _id: projectId, createdBy: userId });
        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not authorized",
                success: false
            });
        }

        const requests = await Request.find({ project: projectId })
            .populate({
                path: 'requester',
                select: 'fullname email skills'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Project requests fetched successfully",
            requests,
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

// Get all requests sent by the current user
export const getMyRequests = async (req, res) => {
    try {
        const userId = req.id;

        const requests = await Request.find({ requester: userId })
            .populate({
                path: 'project',
                select: 'title description requiredSkills status createdBy',
                populate: {
                    path: 'createdBy',
                    select: 'fullname email'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Your requests fetched successfully",
            requests,
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

// Cancel a join request
export const cancelRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.id;

        const request = await Request.findOne({
            _id: requestId,
            requester: userId,
            status: 'pending'
        });

        if (!request) {
            return res.status(404).json({
                message: "Request not found or cannot be cancelled",
                success: false
            });
        }

        await Request.findByIdAndDelete(requestId);

        return res.status(200).json({
            message: "Request cancelled successfully",
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

// Get request status for a project
export const getRequestStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.id;

        const request = await Request.findOne({
            project: projectId,
            requester: userId
        }).select('status');

        return res.status(200).json({
            message: "Request status fetched successfully",
            status: request ? request.status : null,
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