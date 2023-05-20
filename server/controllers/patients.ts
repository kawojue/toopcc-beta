import Patient from '../models/BasicPt'
import { Request, Response } from 'express'
import AltPatient from '../models/AdvancePt'
import full_name from '../utilities/full_name'
import {
    ERROR, FIELDS_REQUIRED, WARNING,
    CARD_NO_REQUIRED, INVALID_AGE, SUCCESS,
    INVALID_PHONE_NO, PATIENT_NOT_EXIST,
} from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const phoneRegex: RegExp = /^\d{11}$/

// add patient data
const add = asyncHandler(async (req: Request, res: Response) => {
    let { card_no, fullname, sex, phone_no, address, age }: any = req.body

    age = Number(age)
    card_no = card_no?.trim()
    address = address?.trim()
    fullname = full_name(fullname)

    if (!card_no || !fullname || !sex || !age) return res.status(400).json(FIELDS_REQUIRED)

    if (phone_no?.trim()) {
        if (!phoneRegex.test(phone_no?.trim())) {
            return res.status(400).json(INVALID_PHONE_NO)
        }
    }

    if (age > 120) {
        return res.status(400).json(INVALID_AGE)
    }

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (patient) {
        return res.status(409).json({
            ...WARNING,
            msg: "Patient already exists."
        })
    }

    await Patient.create({
        sex,
        card_no,
        address,
        fullname,
        phone_no,
        age: age as number,
    })

    res.status(200).json({
        ...SUCCESS,
        msg: "Saved!"
    })
})

// edit patient data
const edit = asyncHandler(async (req: Request, res: Response) => {
    let {
        card_no, fullname, sex, phone_no, address, age,
        death, opthalmology, physiotherapy, walking_stick,
    }: any = req.body

    card_no = card_no?.trim()
    if (!card_no) return res.status(400).json(CARD_NO_REQUIRED)

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) {
        return res.status(404).json(PATIENT_NOT_EXIST)
    }

    if (fullname) {
        fullname = full_name(fullname)
        if (!fullname) {
            return res.status(400).json({
                ...ERROR,
                msg: "Fullname is required."
            })
        }
        patient.fullname = fullname
    }

    if (sex) {
        if (sex !== "Male" && sex !== "Female") {
            return res.status(400).json({
                ...WARNING,
                msg: "Sex is required."
            })
        }
        patient.sex = sex
    }

    if (phone_no) {
        if (!phone_no?.trim() || !phoneRegex.test(phone_no?.trim())) {
            return res.status(400).json({
                ...ERROR,
                msg: "Invalid phone number"
            })
        }
        patient.phone_no = phone_no.trim()
    }

    if (age) {
        age = Number(age)
        if (age > 120) {
            return res.status(400).json({
                ...ERROR,
                msg: "Age is not valid"
            })
        }
        patient.age = age
    }

    if (death?.dead){
        if (Boolean(death?.dead) !== patient.death.dead) {
            if (!death?.date) {
                return res.status(400).json({
                    ...WARNING,
                    msg: "Date of death is required."
                })
            }
            death = {
                dead: !Boolean(patient.dead),
                date: death.date
            }
            patient.death = death
        }
    }

    if (address?.trim()) patient.address = address

    if (opthalmology) opthalmology = Boolean(opthalmology)

    if (physiotherapy) physiotherapy = Boolean(physiotherapy)

    if (walking_stick) walking_stick = Boolean(walking_stick)

    if (!patient.isAdvance) {
        await AltPatient.create({
            patient: patient.id,
            recommendation: {
                opthalmology,
                physiotherapy,
                walking_stick
            }
        })
        patient.isAdvance = true
        await patient.save()
        return res.status(200).json({
            ...SUCCESS,
            msg: "Saved!"
        })
    }

    const altPatient: any = await AltPatient.findOne({ patient: patient.id }).exec()
    altPatient.recommendation = {
        ...altPatient.recommendation,
        opthalmology,
        physiotherapy,
        walking_stick
    }
    await patient.save()
    await altPatient.save()

    res.status(200).json({
        ...SUCCESS,
        msg: "Saved!"
    })
})

const remove = asyncHandler(async (req: Request, res: Response) => {
    let { card_no }: any = req.body
    if (!card_no || !card_no?.trim()) return res.status(400).json(CARD_NO_REQUIRED)

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    if (patient.isAdvance) {
        await AltPatient.deleteOne({ patient: patient.id }).exec()
    }

    await Patient.deleteOne({ card_no }).exec()

    res.status(200).json({
        ...SUCCESS,
        msg: "Patient data has been deleted."
    })
})

export { add, edit, remove }