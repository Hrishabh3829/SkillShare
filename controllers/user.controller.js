import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    try {
        const { fullname, email, password, role, skills, bio, profilePic } = req.body;
        if (!fullname || !email || !password || !role || !skills || !bio || !profilePic) {
            return res.status(404).json({
                message: "Something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            })

        }
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            skills,
            bio,
            profilePic
        })

        return res.status(200).json({
            message: "Account created successfully",
            success: true
        })




    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
            success: true
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            skills: user.skills,
            bio: user.skills,
            profilePic: user.profilePic

        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out Successfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


