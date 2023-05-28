import { v4 as uuid } from 'uuid'
import { IBody, ICloud } from '../type'
import Patient from '../models/Patient'
import delDiag from '../utilities/delDiag'
import { Request, Response } from 'express'
import full_name from '../utilities/full_name'
import cloudinary from '../configs/cloudinary'
import addExtension from '../utilities/addExtension'
import {
    ERROR, FIELDS_REQUIRED, CARD_NO_REQUIRED, INVALID_AGE,
    INVALID_PHONE_NO, PATIENT_NOT_EXIST, SMTH_WENT_WRONG,
    PATIENT_EXIST, SAVED, WARNING, SUCCESS, DELETION_FAILED,
    EXT_NOT_EXIST, DIAG_NOT_EXIST
} from '../utilities/modal'
import addMedic from '../utilities/addMedic'
const asyncHandler = require('express-async-handler')

const phoneRegex: RegExp = /^\d{11}$/

// add patient data
const add = asyncHandler(async (req: Request, res: Response) => {
    let {
        card_no, fullname, sex, phone_no,
        address, age, date
    }: any = req.body

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
        if (!phoneRegex.test(phone_no?.trim())) return res.status(400).json(INVALID_PHONE_NO)
    }

    if (age > 120) return res.status(400).json(INVALID_AGE)
    if (date) date = date

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (patient) return res.status(409).json(PATIENT_EXIST)

    await Patient.create({
        sex, card_no, date,
        address, fullname,
        phone_no, age: age as number,
    })

    res.status(200).json(SAVED)
})

// edit patient data
const edit = asyncHandler(async (req: Request, res: Response) => {
    const { card_no } = req.params
    let {
        fullname, sex, phone_no, address,
        age, death, cardNo
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

    if (death?.dead) {
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

    await patient.save()

    res.status(200).json(SAVED)
})

// delete patient data
const remove = asyncHandler(async (req: Request, res: Response) => {
    let { card_no }: any = req.params
    if (!card_no || !card_no?.trim()) return res.status(400).json(CARD_NO_REQUIRED)

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const bodies: any[] = patient.body
    const del: boolean = await delDiag(bodies)
    if (!del) return res.status(400).json(DELETION_FAILED)

    await Patient.deleteOne({ card_no }).exec()

    res.status(200).json({
        ...SUCCESS,
        msg: "Patient data has been deleted."
    })
})

const addDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    let imageRes: any
    const imageArr: ICloud[] = []
    const { card_no }: any = req.params
    let {
        date, images, texts, next_app
    }: any = req.body

    const patient = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    if (images) {
        images = Array(images)
        if (images.length > 3) return res.status(400).json(SMTH_WENT_WRONG)

        images.forEach(async (image: any) => {
            imageRes = await cloudinary.uploader.upload(image, {
                folder: `TOOPCC/${patient.id}`,
                resource_type: 'image'
            })
            if (!imageRes) return res.status(400).json(SMTH_WENT_WRONG)

            imageArr.push({
                secure_url: imageRes.secure_url,
                public_id: imageRes.public_id
            })
        })
    }

    if (texts) texts = texts.trim()
    if (!date) date = `${new Date().toISOString()}`

    patient.body = (imageArr.length > 0 || texts) ? [
        ...patient.body,
        {
            idx: uuid(),
            diagnosis: {
                texts,
                images: imageArr,
            },
            date,
            next_app
        }
    ] : [ ...patient.body ]
    await patient.save()

    res.status(200).json(SAVED)
})

const editDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    let {
        date, texts, next_app
    }: any = req.body

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const body: any = patient.body.find((body: IBody) => body.idx === idx)
    if (!body) return res.status(404).json(DIAG_NOT_EXIST)

    if (texts) body.diagnosis.texts = texts.trim()
    if (date) body.date = date
    if (next_app) body.next_app = next_app

    await patient.save()

    res.status(200).json(SAVED)
})

const addRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const  { card_no }: any = req.params
    const {
        opthal, extension, physio,
        eligOpthal, eligPhysio
    } : any = req.body

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const rec: any = patient.recommendation
    const opthalmology: any = rec.opthalmology
    const physiotherapy: any = rec.physiotherapy

    if (opthal && opthal?.date) {
        const opthalMedic: any[] = opthalmology.medication
        const newMedics: any[] = addMedic(opthal, opthalMedic)
        opthalmology.medication = newMedics
    }

    if (physio && physio?.date) {
        const physioMedic: any[] = physiotherapy.medication
        const newMedics: any[] = addMedic(physio, physioMedic)
        physiotherapy.medication = newMedics
    }

    if (extension && extension?.name?.trim()) {
        const ext: any[] = rec.extensions
        const newExtensions: any[] = addExtension(ext, extension)
        rec.extensions = newExtensions
    }

    if (eligOpthal) opthalmology.eligible = Boolean(eligOpthal)
    if (eligPhysio) physiotherapy.eligible = Boolean(eligPhysio)

    await patient.save()

    res.status(200).json(SAVED)
})

const deleteRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx, type }: any = req.params
    const patient: any = await Patient.findOne({ card_no: card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    if (type !== "physio" && type !== "opthal") {
        return res.status(400).json({
            ...ERROR,
            msg: "Type is not defined."
        })
    }

    const rec: any = patient.recommendation
    const originalRec: any[] = type === "opthal" ? rec.opthalmology.medication : rec.physiotherapy.medication
    const newRec: any[] = originalRec.filter((medic: any) => medic.idx !== idx)

    if (newRec.length === 0) {
        type === "opthal" ? rec.opthalmology.eligible = false : rec.physiotherapy.eligible = false
    }
    type === "opthal" ? rec.opthalmology.medication = newRec : rec.physiotherapy.medication = newRec
    await patient.save()

    res.status(200).json(SAVED)
})

const deletExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    const patient: any = await Patient.findOne({ card_no: card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const extensions: any[] = patient.recommendation.extensions
    const ext: any = extensions.find((element: any) => element.idx === idx)
    if (!ext) return res.status(404).json(EXT_NOT_EXIST)

    patient.recommendation.extensions = extensions.filter((element: any) => element.idx !== idx)
    await patient.save()

    return res.status(200).json(SAVED)
})

const editExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    const { extension }: any = req.body
    const patient: any = await Patient.findOne({ card_no: card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const extensions: any[] = patient.recommendation.extensions
    const extt: any = extensions.find((element: any) => element.idx === idx)
    if (!extt) return res.status(404).json(EXT_NOT_EXIST)

    patient.recommendation.extensions = extensions.map((ext: any) => ext.idx === idx ? {
        ...ext, ...extension
    } : ext)
    await patient.save()

    return res.status(200).json(SAVED)
})

const deleteDianosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params

    const patient: any = await Patient.findOne({ card_no }).exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const bodies: IBody[] = patient.body
    const body: any = bodies.find((body: IBody) => body.idx === idx)
    if (!body) return res.status(404).json(DIAG_NOT_EXIST)
    
    const images: ICloud[] = body.diagnosis.images
    if (images.length > 0) {
        images.forEach(async (image: ICloud) => {
            const result: any = await cloudinary.uploader.destroy(image.public_id)
            if (!result) return res.status(400).json(DELETION_FAILED)
        })
    }
    patient.body = bodies.filter((body: IBody) => body.idx !== idx)
    await patient.save()

    res.status(200).json({
        ...SUCCESS,
        msg: "Deleted successfully"
    })
})

export {
    add, edit, addDiagnosis, remove,
    deleteDianosis, editDiagnosis,
    addRecommendation, editExtension,
    deletExtension, deleteRecommendation
}