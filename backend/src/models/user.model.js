import mongoose, {Schema} from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

export const User = mongoose.model("User", userSchema)