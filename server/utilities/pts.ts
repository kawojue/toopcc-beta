import Patient from "../models/Patient"

const fetchByCardNumber = async (card_no: string, omit: string = ""): Promise<any> => {
    let patient: any

    if (omit) {
        patient = await Patient.findOne({ card_no }).select(omit).exec()
    }
    patient = await Patient.findOne({ card_no }).exec()

    return patient
}

const fetchPatients = async(omit: string = ""): Promise<any[]> => {
    let patients: any

    if (omit) {
        patients = await Patient.find().select(omit).exec()
    }
    patients = await Patient.find().exec()

    return patients
}

export { fetchByCardNumber, fetchPatients }