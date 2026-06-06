import express from "express"

import { login, logout, profile, register } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.post("/logout", verifyJWT, logout)
userRouter.get("/me", verifyJWT, profile)

export default userRouter
