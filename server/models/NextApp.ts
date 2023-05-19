import mongoose, { Schema } from 'mongoose'

const NextAppModel: Schema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdvancePt",
        required: true,
    },
    next_appointment: [{
        date: String
    }]
})

const NextApp = mongoose.model('NextApp', NextAppModel) || NextAppModel
export default NextApp