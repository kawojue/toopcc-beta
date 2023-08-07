import {
    fetchPatients, findByCardNo
} from '../utilities/model'
import {
    sendError, sendSuccess
} from '../utilities/sendResponse'
import {
    sortByCardNumbers, sortByDates
} from '../utilities/sorting'
import {
    PATIENT_NOT_EXIST, DIAG_NOT_EXIST,
} from '../utilities/modal'
import { getS3 } from '../utilities/s3'
import { Request, Response } from 'express'
import StatusCodes from '../utilities/StatusCodes'
const asyncHandler = require('express-async-handler')


const allPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body -recommendation')

    sendSuccess(res, StatusCodes.OK, { patients: sortByCardNumbers(patients) })
})

const getPatient = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body -recommendation')
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    sendSuccess(res, StatusCodes.OK, { patient })
})

const getAllDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-recommendation')
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const bodies = patient.body.map((body: any) => ({
        ...body,
        diagnosis: body.diagnosis.images.length > 0 ?
            body.diagnosis.images.map(async (image: any) => await getS3(image)) :
            body.diagnosis.images
    }))

    sendSuccess(res, StatusCodes.OK, {
        length: patient.body.length,
        diagnosis: sortByDates(bodies)
    })
})

const getDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params

    const patient = await findByCardNo(card_no, '-recommendation')
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const body = patient.body.find((body: any) => body.idx === idx)
    if (!body) {
        sendError(res, StatusCodes.NotFound, DIAG_NOT_EXIST)
        return
    }

    const updatedBody = {
        ...body,
        diagnosis: body.diagnosis.images.map(async (image: any) => await getS3(image))
    }

    sendSuccess(res, StatusCodes.OK, { diagnosis: sortByDates(updatedBody) })
})

const getAllOpthalPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body')
    const opthals = patients.filter((opthal) => opthal.recommendation?.opthalmology?.eligible === true)

    sendSuccess(res, StatusCodes.OK, {
        length: opthals.length,
        patients: sortByCardNumbers(opthals)
    })
})

const getAllPhysioPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body')
    const physios = patients.filter((physio) => physio.recommendation?.physiotherapy?.eligible === true)

    sendSuccess(res, StatusCodes.OK, {
        length: physios.length,
        patients: sortByCardNumbers(physios)
    })
})

const getAllExtensions = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body')

    const all = patients.map((ext) => {
        let obj: any
        const extensions = ext.recommendation?.extensions
        if (extensions!.length > 0) {
            obj = {
                fullname: ext.fullname,
                extensions: extensions,
                date: extensions![extensions?.length! - 1].date,
                card_no: ext.card_no,
                phone_no: ext.phone_no,
            }
        }
        return obj
    })

    sendSuccess(res, StatusCodes.OK, {
        length: all.length,
        extensions: sortByDates(all)
    })
})

const getDeadPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body -recommendation')

    const deads = patients.filter((dead) => {
        let obj: any
        if (dead.death?.dead === true) {
            const { fullname, age, card_no, address, phone_no } = dead
            obj = {
                fullname, age, card_no,
                phone_no, address,
                date_vist: dead.date,
                date: dead.death.date
            }
        }
        return obj
    })

    sendSuccess(res, StatusCodes.OK, {
        length: deads.length,
        deaths: sortByDates(deads)
    })
})

const getExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body')
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const extensions = patient.recommendation?.extensions

    sendSuccess(res, StatusCodes.OK, {
        patient: {
            fullname: patient.fullname,
            card_no: patient.card_no,
            phone_no: patient.phone_no,
            address: patient.address
        },
        length: extensions?.length,
        extensions: sortByDates(extensions)
    })
})

const getPhysioMedication = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body')
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const medications = patient.recommendation?.physiotherapy?.medication

    sendSuccess(res, StatusCodes.OK, {
        length: medications?.length,
        medications: sortByDates(medications)
    })
})

const getOpthalMedication = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body')
    if (!patient) {
        sendError(res, StatusCodes.NotFound, PATIENT_NOT_EXIST)
        return
    }

    const medications = patient.recommendation?.opthalmology?.medication

    sendSuccess(res, StatusCodes.OK, {
        length: medications?.length,
        medications: sortByDates(medications)
    })
})

export {
    allPatients, getAllDiagnosis, getExtension, getPhysioMedication,
    getDiagnosis, getPatient, getAllExtensions, getOpthalMedication,
    getDeadPatients, getAllOpthalPatients, getAllPhysioPatients
}