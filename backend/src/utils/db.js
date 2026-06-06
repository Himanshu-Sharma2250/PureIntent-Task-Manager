import mongoose from "mongoose"

const connect_db = async () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Database connection established")
        })
        .catch((err) => {
            console.log("Error connecting Database ", err)
            process.exit(1)
        })
}

export default connect_db