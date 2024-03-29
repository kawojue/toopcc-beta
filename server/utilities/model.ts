import User from '../model/User'
import Patient from '../model/Patient'

const findByUser = async (user: string, omit?: string) => {
    if (omit) {
        return await User.findOne({ user }).select(omit).exec()
    } else {
        return await User.findOne({ user }).exec()
    }
}

const findByEmail = async (email: string, omit?: string) => {
    if (omit) {
        return await User.findOne({ email }).select(omit).exec()
    } else {
        return await User.findOne({ email }).exec()
    }
}

const findByToken = async (token: string, omit?: string) => {
    if (omit) {
        return await User.findOne({ token }).select(omit).exec()
    } else {
        return await User.findOne({ token }).exec()
    }
}

const findByCardNo = async (card_no: string, omit?: string) => {
    if (omit) {
        return await Patient.findOne({ card_no }).select(omit).exec()
    } else {
        return await Patient.findOne({ card_no }).exec()
    }
}

const fetchUsers = async (omit?: string) => {
    if (omit) {
        return await User.find().select(omit).exec()
    } else {
        return await User.find().exec()
    }
}

const fetchPatients = async (omit?: string) => {
    if (omit) {
        return await Patient.find().select(omit).exec()
    } else {
        return await Patient.find().exec()
    }
}

export {
    User, Patient,
    findByUser, findByEmail, findByToken,
    findByCardNo, fetchUsers, fetchPatients
}