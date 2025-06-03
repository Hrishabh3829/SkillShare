import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Project'
    },

    requester: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'], default: 'pending'
    }

},{
    timeseries:true
})

export const Request = mongoose.model('Request', requestSchema)