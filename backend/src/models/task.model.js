import mongoose, {Schema} from "mongoose"
import { availableTaskStatus, taskStatusEnums } from "../constant.js"

const taskSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: availableTaskStatus,
            default: taskStatusEnums.PENDING,
        }
    },
    { timestamps: true }
)

export const Task = mongoose.model("Task", taskSchema)