import {
    PATIENT_NOT_EXIST,
    DIAG_NOT_EXIST, SUCCESS,
} from '../utilities/modal'
import {
    fetchPatients, findByCardNo
} from '../utilities/model'
import {
    sortByCardNumbers, sortByDates
} from '../utilities/sorting'
import { Request, Response } from 'express'
import StatusCodes from '../utilities/StatusCodes'
const asyncHandler = require('express-async-handler')

const allPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body -recommendation')

    res.status(StatusCodes.OK).json({ patients: sortByCardNumbers(patients) })
})

const getPatient = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body -recommendation')
    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    res.status(StatusCodes.OK).json({ patient })
})

const getAllDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-recommendation')
    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        length: patient.body.length,
        diagnosis: sortByDates(patient.body)
    })
})

const getDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params

    const patient = await findByCardNo(card_no, '-recommendation')
    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const bodies = patient.body
    const diagnosis = bodies.find((body: any) => body.idx === idx)
    if (!diagnosis) {
        return res.status(StatusCodes.NotFound).json(DIAG_NOT_EXIST)
    }

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        diagnosis: sortByDates(diagnosis)
    })
})

const getAllOpthalPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body')
    const opthals = patients.filter((opthal) => opthal.recommendation?.opthalmology?.eligible === true)

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        length: opthals.length,
        patients: sortByCardNumbers(opthals)
    })
})

const getAllPhysioPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients = await fetchPatients('-body')
    const physios = patients.filter((physio) => physio.recommendation?.physiotherapy?.eligible === true)

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
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

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
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

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        length: deads.length,
        deaths: sortByDates(deads)
    })
})

const getExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body')
    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const extensions = patient.recommendation?.extensions

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
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
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const medications = patient.recommendation?.physiotherapy?.medication

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        length: medications?.length,
        medications: sortByDates(medications!)
    })
})

const getOpthalMedication = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params

    const patient = await findByCardNo(card_no, '-body')
    if (!patient) {
        return res.status(StatusCodes.NotFound).json(PATIENT_NOT_EXIST)
    }

    const medications = patient.recommendation?.opthalmology?.medication

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        length: medications?.length,
        medications: sortByDates(medications!)
    })
})

export {
    allPatients, getAllDiagnosis, getExtension, getPhysioMedication,
    getDiagnosis, getPatient, getAllExtensions, getOpthalMedication,
    getDeadPatients, getAllOpthalPatients, getAllPhysioPatients
}