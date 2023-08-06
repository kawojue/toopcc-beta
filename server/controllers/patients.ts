import sharp from 'sharp'
import { v4 as uuid } from 'uuid'
import handleFile from '../utilities/file'
import { Request, Response } from 'express'
import full_name from '../utilities/full_name'
import StatusCodes from '../utilities/StatusCodes'
import s3, {
    DeleteObjectCommand, DeleteObjectCommandInput,
    PutObjectCommand, PutObjectCommandInput,
} from '../configs/s3'
import { Patient, findByCardNo } from '../utilities/model'
const expressAsyncHandler = require('express-async-handler')
import { sendError, sendSuccess } from '../utilities/sendResponse'
import { addExtension, addMedic } from '../utilities/recommendation'
import {
    FIELDS_REQUIRED, CARD_NO_REQUIRED, INVALID_AGE,
    PATIENT_NOT_EXIST, SMTH_WENT_WRONG, PATIENT_EXIST,
    SAVED, DELETION_FAILED, EXT_NOT_EXIST, DIAG_NOT_EXIST,
    INVALID_PHONE_NO, INVALID_CARD_NO
} from '../utilities/modal'

const phoneRegex: RegExp = /^\d{11}$/
const cardNoRegex: RegExp = /^[a-zA-Z0-9]+$/

// add patient data
const add = expressAsyncHandler(async (req: Request, res: Response) => {
    let {
        card_no, fullname, phone_no,
        address, age, date, sex
    } = req.body

    address = address?.trim()
    fullname = full_name(fullname)
    card_no = card_no?.trim()?.toUpperCase()

    if (!card_no || !fullname || !sex || !age) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    if (!/^\d/.test(age) || age > 120) {
        sendError(res, StatusCodes.BadRequest, INVALID_AGE)
        return
    }

    if (!cardNoRegex.test(card_no)) {
        sendError(res, StatusCodes.BadRequest, INVALID_CARD_NO)
        return
    }

    if (phone_no?.trim()) {
        if (!phoneRegex.test(phone_no?.trim())) {
            sendError(res, StatusCodes.BadRequest, INVALID_PHONE_NO)
            return
        }
    }

    const patient = await findByCardNo(card_no)
    if (patient) {
        sendError(res, StatusCodes.Conflict, PATIENT_EXIST)
        return
    }

    await Patient.create({
        sex, card_no, date,
        address, fullname,
        phone_no, age: age,
    })

    sendSuccess(res, StatusCodes.Created, { msg: SAVED })
})

// edit patient data
const edit = expressAsyncHandler(async (req: Request, res: Response) => {
    const { card_no } = req.params
    let {
        fullname, sex, phone_no, address,
        age, death, cardNo, date
    } = req.body

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    if (cardNo || cardNo?.trim()) {
        cardNo = cardNo.trim().toUpperCase()

        if (!cardNoRegex.test(cardNo)) {
            sendError(res, StatusCodes.BadRequest, INVALID_CARD_NO)
            return
        }

        const cardNoExists = await findByCardNo(cardNo)
        if (cardNoExists) {
            sendError(res, StatusCodes.Conflict, PATIENT_EXIST)
            return
        }
        patient.card_no = cardNo
    }

    if (fullname) {
        fullname = full_name(fullname)
        if (!fullname) {
            sendError(res, StatusCodes.BadRequest, "Fullname is required.")
            return
        }
        patient.fullname = fullname
    }

    if (sex) {
        if (sex !== "Male" && sex !== "Female") {
            sendError(res, StatusCodes.BadRequest, "Sex is required.")
            return
        }
        patient.sex = sex
    }

    if (phone_no) {
        if (!phone_no?.trim() || !phoneRegex.test(phone_no?.trim())) {
            sendError(res, StatusCodes.BadRequest, "Invalid phone number.")
            return
        }
        patient.phone_no = phone_no.trim()
    }

    if (age) {
        if (age > 120) {
            sendError(res, StatusCodes.BadRequest, "Invalid age specified.")
            return
        }
        patient.age = age
    }

    if (death) {
        if (death.dead === true && !death.date) {
            death = { dead: true, date: '' }
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

    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

// delete patient data
const remove = expressAsyncHandler(async (req: Request, res: Response) => {
    let { card_no } = req.params

    if (!card_no || !card_no?.trim()) {
        sendError(res, StatusCodes.BadRequest, CARD_NO_REQUIRED)
        return
    }

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const bodies = patient.body
    try {
        bodies.forEach(async (body: any) => {
            const images = body.diagnosis.images
            if (images.length > 0) {
                images.forEach(async (imagePath: string) => {
                    const params: DeleteObjectCommandInput = {
                        Key: imagePath,
                        Bucket: process.env.BUCKET_NAME!
                    }
                    const command: DeleteObjectCommand = new DeleteObjectCommand(params)
                    await s3.send(command)
                })
            }
        })
    } catch {
        sendError(res, StatusCodes.BadRequest, DELETION_FAILED)
        return
    }

    await patient.deleteOne()

    sendSuccess(res, StatusCodes.OK, { msg: "Patient data has been deleted." })
})

const addDiagnosis = expressAsyncHandler(async (req: Request, res: Response) => {
    const files = req.files as any[]
    let imageArr: string[] = []
    const { card_no } = req.params
    let {
        date, texts, next_app
    } = req.body

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    if (!date) {
        sendError(res, StatusCodes.BadRequest, "Date is required.")
        return
    }

    if (texts || texts?.trim()) {
        texts = texts.trim()
    }

    try {
        if (files.length > 0) {
            files.forEach(async (file: File) => {
                const tempFile = handleFile(res, file)
                const buffer: Buffer = await sharp(tempFile.buffer)
                    .resize({ fit: "contain" })
                    .toBuffer()
                const path = `TOOPCC/${patient.id}/${uuid()}.${tempFile.extension}`

                const params: PutObjectCommandInput = {
                    Bucket: process.env.BUCKET_NAME!,
                    Key: path,
                    Body: buffer,
                    ContentType: tempFile.mimetype
                }
                const command: PutObjectCommand = new PutObjectCommand(params)
                await s3.send(command)

                imageArr.push(path)
            })
        }
    } catch {
        try {
            if (imageArr.length > 0) {
                for (const imagePath of imageArr) {
                    const params: DeleteObjectCommandInput = {
                        Key: imagePath,
                        Bucket: process.env.BUCKET_NAME!,
                    }
                    const command: DeleteObjectCommand = new DeleteObjectCommand(params)
                    await s3.send(command)
                }
            }
        } catch {
            sendError(res, StatusCodes.BadRequest, SMTH_WENT_WRONG)
            return
        }
    }

    const patientBody = patient.body
    patient.body = (imageArr.length > 0 || texts) ? [
        ...patientBody,
        {
            date,
            next_app,
            idx: uuid(),
            diagnosis: {
                texts,
                images: imageArr,
            },
        }
    ] : [...patientBody]

    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

const editDiagnosis = expressAsyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx } = req.params
    let {
        date, texts, next_app
    } = req.body

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const body = patient.body.find((body: any) => body.idx === idx)
    if (!body) {
        sendError(res, StatusCodes.NotFound, DIAG_NOT_EXIST)
        return
    }

    if (texts) {
        body.diagnosis.texts = texts.trim()
    }

    if (date) {
        body.date = date
    }

    if (next_app) {
        body.next_app = next_app
    }

    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

const addRecommendation = expressAsyncHandler(async (req: Request, res: Response) => {
    const { card_no } = req.params
    const {
        opthal, extension, physio,
        eligOpthal, eligPhysio
    } = req.body

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    let extensions = patient.recommendation?.extensions
    const opthalmology = patient.recommendation?.opthalmology
    const physiotherapy = patient.recommendation?.physiotherapy

    if (opthal && opthal?.date) {
        const opthalMedic = opthalmology?.medication
        const newMedics = addMedic(opthal, opthalMedic)
        opthalmology.medication = newMedics
    }

    if (physio && physio?.date) {
        const physioMedic = physiotherapy?.medication
        const newMedics = addMedic(physio, physioMedic as any[])
        physiotherapy.medication = newMedics
    }

    if (extension && extension?.name?.trim()) {
        const newExtensions = addExtension(extensions, extension)
        extensions = newExtensions
    }

    if (eligOpthal) {
        opthalmology.eligible = Boolean(eligOpthal)
    }
    if (eligPhysio) {
        physiotherapy.eligible = Boolean(eligPhysio)
    }

    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

const deleteRecommendation = expressAsyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query
    const { card_no, idx } = req.params

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const rec = patient.recommendation
    const originalRec = type === 'opthal' ?
        rec.opthalmology.medication : type === 'physio' ?
            rec.physiotherapy.medication : []
    const newRec = originalRec?.filter((medic: any) => medic.idx !== idx)

    if (newRec?.length === 0) {
        type === 'opthal' ? rec.opthalmology.eligible = false :
            type === 'physio' ? rec.physiotherapy.eligible = false : null
    }
    type === 'opthal' ? rec.opthalmology.medication = newRec :
        type === 'physio' ? rec.physiotherapy.medication = newRec : null

    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

const deletExtension = expressAsyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx } = req.params

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    let extensions = patient.recommendation?.extensions
    const ext: any = extensions?.find((element: any) => element.idx === idx)

    if (!ext) {
        sendError(res, StatusCodes.NotFound, EXT_NOT_EXIST)
        return
    }

    extensions = extensions?.filter((element: any) => element.idx !== idx)

    patient.recommendation.extensions = extensions
    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

const editExtension = expressAsyncHandler(async (req: Request, res: Response) => {
    const { extension } = req.body
    const { card_no, idx } = req.params

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    let extensions = patient.recommendation?.extensions
    const extt = extensions?.find((element: any) => element.idx === idx)

    if (!extt) {
        sendError(res, StatusCodes.NotFound, EXT_NOT_EXIST)
        return
    }

    extensions = extensions?.map((ext: any) => ext.idx === idx ? {
        ...ext, ...extension
    } : ext)

    patient.recommendation.extensions = extensions
    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: SAVED })
})

const deleteDianosis = expressAsyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx } = req.params

    const patient = await findByCardNo(card_no)
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const bodies = patient.body
    const body = bodies.find((body: any) => body.idx === idx)
    if (!body) {
        sendError(res, StatusCodes.NotFound, DIAG_NOT_EXIST)
        return
    }

    try {
        const images = body.diagnosis.images
        if (images.length > 0) {
            images.forEach(async (imagePath: string) => {
                const params: DeleteObjectCommandInput = {
                    Key: imagePath,
                    Bucket: process.env.BUCKET_NAME!
                }
                const command: DeleteObjectCommand = new DeleteObjectCommand(params)
                await s3.send(command)
            })
        }
    } catch {
        sendError(res, StatusCodes.BadRequest, DELETION_FAILED)
        return
    }
    patient.body = bodies.filter((body: any) => body.idx !== idx)
    await patient.save()

    sendSuccess(res, StatusCodes.OK, { msg: "Deleted successfully" })
})

export {
    edit, remove, deleteDianosis, editDiagnosis, deleteRecommendation,
    add, addRecommendation, editExtension, deletExtension, addDiagnosis,
}