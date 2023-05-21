import { v4 as uuid } from 'uuid'
import Patient from '../models/BasicPt'
import { Request, Response } from 'express'
import AltPatient from '../models/AdvancePt'
import full_name from '../utilities/full_name'
import cloudinary from '../configs/cloudinary'
import {
    ERROR, FIELDS_REQUIRED, WARNING,
    CARD_NO_REQUIRED, INVALID_AGE, SUCCESS,
    INVALID_PHONE_NO, PATIENT_NOT_EXIST,
    SMTH_WENT_WRONG, PATIENT_EXIST,
} from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const phoneRegex: RegExp = /^\d{11}$/

// add patient data
const add = asyncHandler(async (req: Request, res: Response) => {
    let { card_no, fullname, sex, phone_no, address, age }: any = req.body

    age = Number(age)
    card_no = card_no.trim()
    address = address?.trim()
    fullname = full_name(fullname)

    if (!card_no || !fullname || !sex || !age) return res.status(400).json(FIELDS_REQUIRED)

    if (card_no.includes('/')) {
        return res.status(400).json({
            ...WARNING,
            msg: "Invalid card number."
        })
    }

    if (phone_no?.trim()) {
        if (!phoneRegex.test(phone_no?.trim())) {
            return res.status(400).json(INVALID_PHONE_NO)
        }
    }

    if (age > 120) {
        return res.status(400).json(INVALID_AGE)
    }

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (patient) return res.status(409).json(PATIENT_EXIST)

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
    const { card_no } = req.params
    let {
        fullname, sex, phone_no, address,
        age, death, cardNo, walking_stick,
        opthalmology, physiotherapy,
    }: any = req.body

    if (!card_no) return res.status(400).json(CARD_NO_REQUIRED)

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    if (cardNo || cardNo?.trim()) {
        cardNo = cardNo.trim()
        const cardNoExists: any = await Patient.findOne({ card_no: cardNo }).exec()
        if (cardNoExists) return res.status(409).json(PATIENT_EXIST)
        patient.card_no = cardNo
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

    const recommendation = {
        opthalmology,
        physiotherapy,
        walking_stick
    }

    if (!patient.isAdvance) {
        await AltPatient.create({
            patient: patient.id,
            recommendation
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
        ...recommendation
    }
    await patient.save()
    await altPatient.save()

    res.status(200).json({
        ...SUCCESS,
        msg: "Saved!"
    })
})

// delete patient data
const remove = asyncHandler(async (req: Request, res: Response) => {
    let { card_no }: any = req.params
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

const addDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    let imageRes: any
    const imageArr: {
        secure_url: string
        public_id: string
    }[] = []
    const { card_no }: any = req.params
    let {
        date_visit, images, texts,
        physiotherapy, opthalmology, walking_stick
    }: any = req.body

    if (!card_no) return res.status(400).json(CARD_NO_REQUIRED)

    const patient = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    if (images) {
        images = Array(images)
        if (images.length > 3) {
            return res.status(400).json(SMTH_WENT_WRONG)
        }

        if (images.length > 0) {
            images.forEach(async (image: any) => {
                imageRes = await cloudinary.uploader.upload(image, {
                    folder: `TOOPCC/${patient.id}`,
                    resource_type: 'image'
                })

                if (!imageRes) {
                    return res.status(400).json(SMTH_WENT_WRONG)
                }

                imageArr.push({
                    secure_url: imageRes.secure_url,
                    public_id: imageRes.public_id
                })
            })
        }
    }

    if (texts) {
        texts = texts.trim()
    }

    if (!date_visit) {
        date_visit = `${new Date().toISOString()}`
    }

    if (opthalmology) opthalmology = Boolean(opthalmology)

    if (physiotherapy) physiotherapy = Boolean(physiotherapy)

    if (walking_stick) walking_stick = Boolean(walking_stick)

    const recommendation = {
        opthalmology,
        physiotherapy,
        walking_stick
    }

    if (!patient.isAdvance) {
        await AltPatient.create({
            patient: patient.id,
            recommendation,
            body: [{
                idx: uuid(),
                diagnosis: {
                    texts,
                    images: imageArr,
                },
                date_visit
            }]
        })
        patient.isAdvance = true
        await patient.save()

        return res.sendStatus(200)
    }

    const altPatient: any = await AltPatient.findOne({ patient: patient.id }).exec()
    altPatient.recommendation = {
        ...altPatient.recommendation,
        ...recommendation,
    }
    altPatient.body = [
        ...altPatient.body,
        {
            idx: uuid(),
            diagnosis: {
                texts,
                images: imageArr,
            },
            date_visit
        }
    ]
    await altPatient.save()
    res.sendStatus(200)
})

export { add, edit, remove, addDiagnosis }