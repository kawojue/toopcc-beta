import mongoose, { Schema } from 'mongoose'

const AdvancePtModel: Schema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        sparse: true,
        unique: true,
        required: true,
    },
    recommendation: {
        medication: {
            type: Boolean,
            default: true
        },
        opthalmology: Boolean,
        physiotherapy: Boolean,
        walking_stick: Boolean
    },
    body: {
        type: [{
            diagnosis: {
                images: Array,
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

const AdvancePt = mongoose.model('AdvancePt', AdvancePtModel) || AdvancePtModel
export default AdvancePt