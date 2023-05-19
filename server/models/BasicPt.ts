import mongoose, { Schema } from 'mongoose'

const BasicPtModel: Schema = new Schema({
    card_no: {
        type: String,
        unique: true,
        sparse: true,
        required: true,
    },
    fullname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: `${new Date().toISOString()}`
    },
    death: {
        dead: {
            type: Boolean,
            default: false
        },
        date: String,
    },
    phone_no: String,
    address: String,
})

const BasicPt = mongoose.model('Patient', BasicPtModel) || BasicPtModel
export default BasicPt