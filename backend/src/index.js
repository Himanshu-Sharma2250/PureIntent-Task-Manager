import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import connect_db from "./utils/db.js"
import userRouter from "./routers/user.router.js"
import taskRouter from "./routers/task.router.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || "http://localhost:4000"

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/", (req, res) => {
    res.send("Server is live")
})

connect_db()

app.use("/api/v1/auth", userRouter)
app.use("/api/v1/task", taskRouter)

app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}`)
})