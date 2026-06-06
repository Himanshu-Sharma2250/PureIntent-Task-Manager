import { z } from "zod"

export const registerUserSchema = z.object({
    name: z.string().trim(),
    email: z.email("Enter Valid Email").trim(),
    password: z.string().min(8)
})

export const loginUserSchema = z.object({
    email: z.email("Enter Valid Email").trim(),
    password: z.string().min(8)
})