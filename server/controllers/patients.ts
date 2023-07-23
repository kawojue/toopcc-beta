import prisma from '../prisma'
import { v4 as uuid } from 'uuid'
import { Images, IBody } from '../type'
import delDiag from '../utilities/delDiag'
import { Request, Response } from 'express'
import addMedic from '../utilities/addMedic'
import full_name from '../utilities/full_name'
import cloudinary from '../configs/cloudinary'
import StatusCodes from '../utilities/StatusCodes'
import addExtension from '../utilities/addExtension'
const asyncHandler = require('express-async-handler')
import {
    PATIENT_NOT_EXIST, SMTH_WENT_WRONG, PATIENT_EXIST, SAVED, SUCCESS,
    DELETION_FAILED, EXT_NOT_EXIST, DIAG_NOT_EXIST, INVALID_PHONE_NO,
    ERROR, FIELDS_REQUIRED, CARD_NO_REQUIRED, INVALID_AGE,
} from '../utilities/modal'

const phoneRegex: RegExp = /^\d{11}$/

// add patient data
const add = asyncHandler(async (req: Request, res: Response) => {
    let {
        card_no, fullname, phone_no,
        address, age, date, sex
    }: any = req.body

    address = address?.trim()
    fullname = full_name(fullname)
    card_no = card_no?.trim()?.toUpperCase()

    if (!card_no || !fullname || !sex || !age) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    if (/^\d/.test(age)) {
        age = Number(age)
    }

    if (!/^[a-zA-Z0-9]+$/.test(card_no)) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "Invalid card number."
        })
    }

    if (phone_no?.trim()) {
        if (!phoneRegex.test(phone_no?.trim())) {
            return res.status(StatusCodes.BadRequest).json(INVALID_PHONE_NO)
        }
    }

    if (age > 120) {
        return res.status(StatusCodes.BadRequest).json(INVALID_AGE)
    }

    if (date) {
        date = date
    }

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (patient) {
        return res.status(StatusCodes.Conflict).json(PATIENT_EXIST)
    }

    await prisma.patient.create({
        data: {
            sex, card_no, date,
            address, fullname,
            phone_no, age: age,
        }
    })

    res.status(StatusCodes.Created).json(SAVED)
})

// edit patient data
const edit = asyncHandler(async (req: Request, res: Response) => {
    const { card_no } = req.params
    let {
        fullname, sex, phone_no, address,
        age, death, cardNo, date
    }: any = req.body

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    if (cardNo || cardNo?.trim()) {
        cardNo = cardNo.trim().toUpperCase()

        const cardNoExists = await prisma.patient.findUnique({
            where: {
                card_no: cardNo
            }
        })

        if (cardNoExists) {
            return res.status(StatusCodes.Conflict).json(PATIENT_EXIST)
        }

        patient.card_no = cardNo
    }

    if (fullname) {
        fullname = full_name(fullname)
        if (!fullname) {
            return res.status(StatusCodes.BadRequest).json({
                ...ERROR,
                msg: "Fullname is required."
            })
        }

        patient.fullname = fullname
    }

    if (sex) {
        if (sex !== "Male" && sex !== "Female") {
            return res.status(StatusCodes.BadRequest).json({
                ...ERROR,
                msg: "Sex is required."
            })
        }

        patient.sex = sex
    }

    if (phone_no) {
        if (!phone_no?.trim() || !phoneRegex.test(phone_no?.trim())) {
            return res.status(StatusCodes.BadRequest).json({
                ...ERROR,
                msg: "Invalid phone number."
            })
        }

        patient.phone_no = phone_no.trim()
    }

    if (age) {
        if (age > 120) {
            return res.status(StatusCodes.BadRequest).json({
                ...ERROR,
                msg: "Invalid Age specified."
            })
        }

        patient.age = age
    }

    if (death) {
        if (death.dead === true && !death.date) {
            return res.status(StatusCodes.BadRequest).json({
                ...ERROR,
                msg: 'Death date is required'
            })
        }

        if (death.dead === false) {
            death = { dead: false, date: '' }
        }

        patient.death = death
    }

    if (address?.trim()) {
        patient.address = address
    }

    if (date) {
        patient.date = date
    }

    await prisma.patient.update({
        where: { card_no },
        data: patient
    })

    res.status(StatusCodes.OK).json(SAVED)
})

// delete patient data
const remove = asyncHandler(async (req: Request, res: Response) => {
    let { card_no }: any = req.params

    if (!card_no || !card_no?.trim()) {
        return res.status(StatusCodes.BadRequest).json(CARD_NO_REQUIRED)
    }

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const bodies: any[] = patient.body
    const del: boolean = await delDiag(bodies)

    if (!del) {
        return res.status(StatusCodes.BadRequest).json(DELETION_FAILED)
    }

    await prisma.patient.delete({
        where: { card_no }
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "Patient data has been deleted."
    })
})

const addDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    let imageRes: any
    const imageArr: Images[] = []
    const { card_no }: any = req.params
    let {
        date, images, texts, next_app
    }: any = req.body

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    if (!date) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "Current date is required."
        })
    }

    if (texts || texts?.trim()) {
        texts = texts.trim()
    }

    if (images.length > 0) {
        if (images.length > 3) {
            return res.status(StatusCodes.BadRequest).json(SMTH_WENT_WRONG)
        }

        images.forEach(async (image: any) => {
            imageRes = await cloudinary.uploader.upload(image, {
                folder: `TOOPCC/${patient.id}`,
                resource_type: 'image'
            })

            if (!imageRes) {
                return res.status(StatusCodes.BadRequest).json(SMTH_WENT_WRONG)
            }

            imageArr.push({
                secure_url: imageRes.secure_url,
                public_id: imageRes.public_id
            })
        })
    }

    const body = (imageArr.length > 0 || texts) ? [
        ...patient.body,
        {
            date,
            next_app,
            idx: uuid(),
            diagnosis: {
                texts,
                images: imageArr,
            },
        }
    ] : [...patient.body]

    await prisma.patient.update({
        where: { card_no },
        data: { body }
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const editDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    let {
        date, texts, next_app
    }: any = req.body

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const body = patient.body.find((body) => body.idx === idx)

    if (!body) {
        return res.status(StatusCodes.NotFound).json(DIAG_NOT_EXIST)
    }

    if (texts) {
        body.diagnosis = {
            texts: texts.trim(),
            images: [...body.diagnosis.images]
        }
    }

    if (date) {
        body.date = date
    }

    if (next_app) {
        body.next_app = next_app
    }

    await prisma.patient.update({
        where: { card_no },
        data: patient
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const addRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const {
        opthal, extension, physio,
        eligOpthal, eligPhysio
    }: any = req.body

    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)

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

    res.status(StatusCodes.OK).json(SAVED)
})

const deleteRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const { type }: any = req.query
    const { card_no, idx }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)

    const rec: any = patient.recommendation
    const originalRec: any[] = type === "opthal" ?
        rec.opthalmology.medication : type === "physio" ?
            rec.physiotherapy.medication : []
    const newRec: any[] = originalRec.filter((medic: any) => medic.idx !== idx)

    if (newRec.length === 0) {
        type === "opthal" ? rec.opthalmology.eligible = false :
            type === "physio" ? rec.physiotherapy.eligible = false : null
    }
    type === "opthal" ? rec.opthalmology.medication = newRec :
        type === "physio" ? rec.physiotherapy.medication = newRec : null
    await patient.save()

    res.status(StatusCodes.OK).json(SAVED)
})

const deletExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)

    const extensions: any[] = patient.recommendation.extensions
    const ext: any = extensions.find((element: any) => element.idx === idx)
    if (!ext) return res.status(StatusCodes.NotFound).json(EXT_NOT_EXIST)

    patient.recommendation.extensions = extensions.filter((element: any) => element.idx !== idx)
    await patient.save()

    res.status(StatusCodes.OK).json(SAVED)
})

const editExtension = asyncHandler(async (req: Request, res: Response) => {
    const { extension }: any = req.body
    const { card_no, idx }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)

    const extensions: any[] = patient.recommendation.extensions
    const extt: any = extensions.find((element: any) => element.idx === idx)
    if (!extt) return res.status(StatusCodes.NotFound).json(EXT_NOT_EXIST)

    patient.recommendation.extensions = extensions.map((ext: any) => ext.idx === idx ? {
        ...ext, ...extension
    } : ext)
    await patient.save()

    res.status(StatusCodes.OK).json(SAVED)
})

const deleteDianosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params

    const patient: any = await fetchByCardNumber(card_no, '-recommendation')
    if (!patient) return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)

    const bodies: IBody[] = patient.body
    const body: any = bodies.find((body: IBody) => body.idx === idx)
    if (!body) return res.status(StatusCodes.NotFound).json(DIAG_NOT_EXIST)

    const images: Images[] = body.diagnosis.images
    if (images.length > 0) {
        images.forEach(async (image: Images) => {
            const result: any = await cloudinary.uploader.destroy(image.public_id)
            if (!result) return res.status(StatusCodes.BadRequest).json(DELETION_FAILED)
        })
    }
    patient.body = bodies.filter((body: IBody) => body.idx !== idx)
    await patient.save()

    res.status(StatusCodes.OK).json({
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