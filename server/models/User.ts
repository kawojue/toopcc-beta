import mongoose, { Schema } from "mongoose"

const UserModel: Schema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    },
    mail: {
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: `${new Date().toISOString()}`
    },
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
    OTP: {
        totp: String,
        totpDate: Number
    },
    token: String,
    avatar: String,
    lastLogin: String,
})

const User = mongoose.model('User', UserModel) || UserModel
export default User