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
    sex: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: new Date().toISOString()
    },
    death: {
        type: Boolean,
        default: false
    },
    phone_no: String,
    address: String,
    age: Number,
})

const BasicPt = mongoose.model('Patient', BasicPtModel) || BasicPtModel
export default BasicPt