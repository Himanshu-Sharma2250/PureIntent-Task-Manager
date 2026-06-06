import { z } from "zod"

export const createTaskSchema = z.object({
    title: z.string().min(1).trim(),
    description: z.string().min(1).trim().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETE"]).default("PENDING")
})

export const editTaskSchema = z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().min(1).trim().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETE"]).optional()
})