import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createTask, deleteTask, editTask, getAllTasks, getTask } from "../controllers/task.controller.js"

const taskRouter = express.Router()

taskRouter.post("/create", verifyJWT, createTask)
taskRouter.put("/edit/:id", verifyJWT, editTask)
taskRouter.get("/:id", verifyJWT, getTask)
taskRouter.get("/", verifyJWT, getAllTasks)
taskRouter.delete("/delete/:id", verifyJWT, deleteTask)

export default taskRouter