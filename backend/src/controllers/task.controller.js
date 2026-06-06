import { Task } from "../models/task.model.js"
import { createTaskSchema, editTaskSchema } from "../validations/task.validation.js"

// create task
export const createTask = async (req, res) => {
    try {
        const {data, error} = createTaskSchema.safeParse(req.body)
        
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        }
        
        const { title, description, status } = data

        const exist = await Task.findOne({ title })

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "Task already created"
            })
        }

        const task = await Task.create({
            title,
            description,
            status,
            userId: req.user.id
        })

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task creation failed"
            })
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                createdAt: task.createdAt
            }
        })
    } catch (error) {
        console.error("Error in create task controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error creating task"
        })
    }
}

// edit task
export const editTask = async (req, res) => {
    try {
        const {data, error} = editTaskSchema.safeParse(req.body)
        const { id } = req.params
        
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        }

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "id not found"
            })
        }
        
        const { title, description, status } = data

        const task = await Task.findByIdAndUpdate(id,
            {
                title,
                description,
                status
            },
            { returnDocument: 'after' }
        )

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        res.status(201).json({
            success: true,
            message: "Task Updated successfully",
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                updatedAt: task.updatedAt
            }
        })
    } catch (error) {
        console.error("Error in edit task controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error editing task"
        })
    }
}

// get task
export const getTask = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "id not found"
            })
        }

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "task not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status,
                updatedAt: task.updatedAt,
                createdAt: task.createdAt
            }
        })
    } catch (error) {
        console.error("Error in get task controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error fetching task"
        })
    }
}

// get all tasks - add pagination
export const getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.search || ""
        const skip = (page - 1) * limit

        const query = { userId: req.user.id }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        const totalTasks = await Task.countDocuments(query)
        
        const tasks = await Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-userId")

        if (!tasks) {
            return res.status(404).json({
                success: false,
                message: "tasks not found"
            })
        }

        const normalizedTasks = tasks.map(task => ({
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        }))

        res.status(200).json({
            success: true,
            message: "Fetched tasks successfully",
            tasks: normalizedTasks,
            pagination: {
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                currentPage: page,
                limit
            }
        })
    } catch (error) {
        console.error("Error in get all tasks controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error fetching tasks"
        })
    }
}

// delete task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(404).json({
                success: false,
                message: "id not found"
            })
        }

        const deleteTask = await Task.findByIdAndDelete(id)

        if (!deleteTask) {
            return res.status(400).json({
                success: false,
                message: "Failed to delete task"
            })
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        })
    } catch (error) {
        console.error("Error in delet tasks controller: ", error)
        res.status(500).json({
            success: false,
            message: "Error deleting task"
        })
    }
}