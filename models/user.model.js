import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'

    },
    skills: [String],

    bio: {
        type: String
    },
    profilePic: {
        type: String
    }


}, { timestamps: true }

)

export const User = mongoose.model('User', userSchema)