import mongoose, { Schema } from "mongoose"

const UserModel: Schema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    totp: String,
    token: String,
    totp_date: Number,
    lastLogin: String,
    avatar_path: String,
    resigned: {
        date: String,
        resign: {
            type: Boolean,
            default: false
        }
    },
    roles: {
        type: Array,
        default: ["staff"]
    },
    createdAt: {
        type: String,
        default: new Date().toISOString()
    },
})

const User = mongoose.model('User', UserModel) || UserModel
export default User