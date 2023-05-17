import mongoose, { Schema } from 'mongoose'

const NextAppModel: Schema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdvancePt",
        sparse: true,
        unique: true,
        required: true,
    },
    next_appointment: String
})

const NextApp = mongoose.model('NextApp', NextAppModel) || NextAppModel
export default NextApp