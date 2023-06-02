import User from '../models/User'
import Patient from "../models/Patient"

const fetchByCardNumber = async (card_no: string, omit: string = ""): Promise<any> => {
    if (omit === "") {
        return await Patient.findOne({ card_no }).exec()
    }
    return await Patient.findOne({ card_no }).select(omit).exec()
}

const fetchUserByUser = async (user: string, omit: string = ""): Promise<any> => {
    if (omit === "") {
        return await User.findOne({ user }).exec()
    }
    return await User.findOne({ user }).select(omit).exec()
}

const fetchUserByEmail = async (email: string, omit: string = ""): Promise<any> => {
    if (omit === "") {
        return await User.findOne({ 'mail.email': email }).exec()
    }
    return await User.findOne({ 'mail.email': email }).select(omit).exec()
}

const fetchPatients = async(omit: string = ""): Promise<any[]> => {
    if (omit === "") {
        return await Patient.find().exec()
    }
    return await Patient.find().select(omit).exec()
}

const fetchUsers = async(omit: string = ""): Promise<any[]> => {
    if (omit === "") {
        return await User.find().exec()
    }
    return await User.find().select(omit).exec()
}



export {
    fetchUserByUser, fetchUsers,
    fetchByCardNumber, fetchPatients,
    fetchUserByEmail
}