import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Project reference is required"],
        index: true
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Requester reference is required"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: "Status must be either 'pending', 'accepted', or 'rejected'"
        },
        default: 'pending',
        index: true
    },
    message: {
        type: String,
        trim: true,
        maxlength: [500, "Message cannot exceed 500 characters"]
    },
    responseMessage: {
        type: String,
        trim: true,
        maxlength: [500, "Response message cannot exceed 500 characters"]
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to prevent duplicate requests
requestSchema.index({ project: 1, requester: 1 }, { unique: true });

// Virtual for checking if request is pending
requestSchema.virtual('isPending').get(function() {
    return this.status === 'pending';
});

// Pre-save middleware to prevent duplicate requests
requestSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingRequest = await this.constructor.findOne({
            project: this.project,
            requester: this.requester,
            status: 'pending'
        });
        if (existingRequest) {
            throw new Error('A pending request already exists for this project');
        }
    }
    next();
});

export const Request = mongoose.model('Request', requestSchema);