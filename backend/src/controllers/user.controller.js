import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { User } from "../models/user.model.js"
import { loginUserSchema, registerUserSchema } from "../validations/user.validation.js"

// register user
export const register = async (req, res) => {
    try {
        const {data, error} = registerUserSchema.safeParse(req.body)

        if (error) {
            return res.status(400).json({
                message: error.message
            })
        }

        const { name, email, password } = data

        const exists = await User.findOne({ email })

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already registered"
            })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User registration failed"
            })
        }

        res.status(201).json({
            success: true,
            message: "User registered Successfully",
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        })
    } catch (error) {
        console.error("Error in register controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error registering User"
        })
    }
}

// login user
export const login = async (req, res) => {
    try {
        const {data, error} = loginUserSchema.safeParse(req.body)

        if (error) {
            return res.status(400).json({
                message: error.message
            })
        }

        const { email, password } = data

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Either Email or Password is wrong"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'none'
        }

        res
            .status(200)
            .cookie("accessToken", token, cookieOptions)
            .json({
                success: true,
                message: "User logged in successfully",
                user: {
                    name: user.name,
                    email: user.email,
                    id: user._id
                }
            })
    } catch (error) {
        console.error("Error in login controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error in user login"
        })
    }
}

// logout user
export const logout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'none'
        }

        res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .json({
                success: true,
                message: "User logged out successfully",
            })
    } catch (error) {
        console.error("Error in logout controller: ", error)
        res.status(500).json({
            success: false,
            message: "Failed to logout user"
        })
    }
}

// profile of user
export const profile = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. User identity could not be determined"
            })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: false,
            message: "Fetched profile successfully",
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        })
    } catch (error) {
        console.error("Error in profile controller: ", error)
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        })
    }
}