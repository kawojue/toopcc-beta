import mongoose, { Schema } from 'mongoose'

const AdvancePtModel: Schema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    recommendation: {
        medication: {
            type: Boolean,
            default: true
        },
        opthalmology: {
            type: Boolean,
            default: false
        },
        physiotherapy: {
            type: Boolean,
            default: false
        },
        walking_stick: {
            type: Boolean,
            default: false
        }
    },
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

const AdvancePt = mongoose.model('AdvancePt', AdvancePtModel) || AdvancePtModel
export default AdvancePt