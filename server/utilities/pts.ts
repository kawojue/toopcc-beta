import Patient from "../models/Patient"

const fetchByCardNumber = async (card_no: string, omit: string = ""): Promise<any> => {
    if (omit === "") {
        return await Patient.findOne({ card_no }).exec()
    }
    return await Patient.findOne({ card_no }).select(omit).exec()
}

const fetchPatients = async(omit: string = ""): Promise<any[]> => {
    if (omit === "") {
        return await Patient.find().exec()
    }
    return await Patient.find().select(omit).exec()
}

export { fetchByCardNumber, fetchPatients }