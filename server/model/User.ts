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
    avatar: {
        secure_url: String,
        public_id: String
    },
    OTP: {
        totp: String,
        totpDate: Number
    },
    token: String,
    lastLogin: String,
})

const User = mongoose.model('User', UserModel) || UserModel
export default User