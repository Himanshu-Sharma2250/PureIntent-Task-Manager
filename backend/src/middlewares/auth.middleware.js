import jwt from "jsonwebtoken"

import { User } from "../models/user.model.js"

export const verifyJWT = async (req, res, next) => {
    try {
        const jwtToken = req.cookies?.accessToken

        if (!jwtToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            })
        }

        const decodeToken = jwt.verify(jwtToken, process.env.JWT_SECRET)

        const user = await User.findById(decodeToken?.id).select(
            "-password"
        )

        req.user = user
        next()
    } catch (error) {
        console.error("Error in verifyJWT: ", error);
        res.status(500).json({
            success: false,
            message: "Invalid access token"
        })
    }
}