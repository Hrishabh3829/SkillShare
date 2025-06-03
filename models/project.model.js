import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },

    description: { type: String, required: true },
    
    requiredSkills: { type: [String], required: true },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
    members: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]

}, { timestamps: true })

export const Project = mongoose.model('Project', projectSchema)