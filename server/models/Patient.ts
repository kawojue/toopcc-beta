import mongoose, { Schema } from 'mongoose'

const PatientModel: Schema = new Schema({
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
    body: {
        type: [{
            idx: String,
            diagnosis: {
                images: [{
                    secure_url: String,
                    public_id: String
                }],
                texts: String
            },
            date_visit: {
                type: String,
                required: true
            }
        }],
        default: []
    }
})

const Patient = mongoose.model('Patient', PatientModel) || PatientModel
export default Patient