import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Title is required"],
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: { 
        type: String, 
        required: [true, "Description is required"],
        trim: true,
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    requiredSkills: { 
        type: [String], 
        required: [true, "At least one skill is required"],
        validate: {
            validator: function(skills) {
                return skills.length > 0 && skills.length <= 10;
            },
            message: "Project must have between 1 and 10 required skills"
        }
    },
    status: {
        type: String,
        enum: {
            values: ['open', 'closed'],
            message: "Status must be either 'open' or 'closed'"
        },
        default: 'open'
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "Creator is required"]
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        validate: {
            validator: function(members) {
                return members.length <= 10;
            },
            message: "Project cannot have more than 10 members"
        }
    }],
    maxMembers: {
        type: Number,
        default: 5,
        min: [1, "Minimum 1 member required"],
        max: [10, "Maximum 10 members allowed"]
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for checking if project is full
projectSchema.virtual('isFull').get(function() {
    return this.members.length >= this.maxMembers;
});

// Index for faster queries
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ status: 1, createdBy: 1 });
projectSchema.index({ requiredSkills: 1 });

export const Project = mongoose.model('Project', projectSchema);