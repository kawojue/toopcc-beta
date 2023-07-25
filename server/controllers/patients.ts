import prisma from '../prisma'
import { Images } from '../type'
import { v4 as uuid } from 'uuid'
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
    } = req.body

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
    } = req.body

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
    let { card_no } = req.params

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
    const { card_no } = req.params
    let {
        date, images, texts, next_app
    } = req.body

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

    if (images.length > 0 && images.length <= 3) {
        images.forEach(async (image: string) => {
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

    patient.body = (imageArr.length > 0 || texts) ? [
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
        data: patient
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const editDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx } = req.params
    let {
        date, texts, next_app
    } = req.body

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
    const { card_no } = req.params
    const {
        opthal, extension, physio,
        eligOpthal, eligPhysio
    } = req.body

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    let extensions = patient.recommendation?.extensions
    const opthalmology = patient.recommendation?.opthalmology
    const physiotherapy = patient.recommendation?.physiotherapy

    if (opthal && opthal?.date) {
        const opthalMedic = opthalmology?.medication
        const newMedics = addMedic(opthal, opthalMedic as any[])
        opthalmology!.medication = newMedics
    }

    if (physio && physio?.date) {
        const physioMedic = physiotherapy?.medication
        const newMedics = addMedic(physio, physioMedic as any[])
        physiotherapy!.medication = newMedics
    }

    if (extension && extension?.name?.trim()) {
        const newExtensions = addExtension(extensions as any, extension)
        extensions = newExtensions as any
    }

    if (eligOpthal) {
        patient.recommendation!.opthalmology!.eligible = Boolean(eligOpthal)
    }
    if (eligPhysio) {
        physiotherapy!.eligible = Boolean(eligPhysio)
    }

    await prisma.patient.update({
        where: { card_no },
        data: patient
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const deleteRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query
    const { card_no, idx } = req.params
    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const rec = patient.recommendation
    const originalRec = type === 'opthal' ?
        rec!.opthalmology.medication : type === 'physio' ?
            rec!.physiotherapy.medication : []
    const newRec = originalRec?.filter((medic) => medic.idx !== idx)

    if (newRec?.length === 0) {
        type === 'opthal' ? rec!.opthalmology.eligible = false :
            type === 'physio' ? rec!.physiotherapy.eligible = false : null
    }
    type === 'opthal' ? rec!.opthalmology.medication = newRec :
        type === 'physio' ? rec!.physiotherapy.medication = newRec : null

    await prisma.patient.update({
        where: { card_no },
        data: patient
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const deletExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx } = req.params
    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    let extensions = patient.recommendation?.extensions
    const ext: any = extensions?.find((element: any) => element.idx === idx)

    if (!ext) {
        return res.status(StatusCodes.NotFound).json(EXT_NOT_EXIST)
    }

    extensions = extensions?.filter((element) => element.idx !== idx)

    await prisma.patient.update({
        where: { card_no },
        data: {
            recommendation: {
                extensions: extensions as any
            }
        }
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const editExtension = asyncHandler(async (req: Request, res: Response) => {
    const { extension } = req.body
    const { card_no, idx } = req.params
    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    let extensions = patient.recommendation?.extensions
    const extt = extensions?.find((element) => element.idx === idx)

    if (!extt) {
        return res.status(StatusCodes.NotFound).json(EXT_NOT_EXIST)
    }

    extensions = extensions?.map((ext) => ext.idx === idx ? {
        ...ext, ...extension
    } : ext)

    await prisma.patient.update({
        where: { card_no },
        data: {
            recommendation: {
                extensions: extensions as any
            }
        }
    })

    res.status(StatusCodes.OK).json(SAVED)
})

const deleteDianosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx } = req.params

    const patient = await prisma.patient.findUnique({
        where: { card_no }
    })

    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const bodies = patient.body
    const body = bodies.find((body) => body.idx === idx)

    if (!body) {
        return res.status(StatusCodes.NotFound).json(DIAG_NOT_EXIST)
    }

    const images: Images[] = body.diagnosis.images
    if (images.length > 0) {
        images.forEach(async (image: Images) => {
            const result: any = await cloudinary.uploader.destroy(image.public_id as string)

            if (!result) {
                return res.status(StatusCodes.BadRequest).json(DELETION_FAILED)
            }
        })
    }

    patient.body = bodies.filter((body) => body.idx !== idx)
    await prisma.patient.update({
        where: { card_no },
        data: patient
    })

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