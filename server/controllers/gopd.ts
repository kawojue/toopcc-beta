import { IBody } from '../type'
import { Request, Response } from 'express'
import {
    PATIENT_NOT_EXIST,
    DIAG_NOT_EXIST, SUCCESS,
} from '../utilities/modal'
import {
    sortByCardNumbers, sortByDates
} from '../utilities/sorting'
import {
    fetchByCardNumber, fetchPatients
} from '../utilities/pts'
const asyncHandler = require('express-async-handler')

const allPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any[] = await fetchPatients('-body -recommendation')

    res.status(200).json({
        ...SUCCESS,
        patients: sortByCardNumbers(patients)
    })
})

const getPatient = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body -recommendation')
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    res.status(200).json({
        ...SUCCESS,
        patient
    })
})

const getAllDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-recommendation')
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    res.status(200).json({
        ...SUCCESS,
        length: patient.body.length,
        diagnosis: sortByDates(patient.body)
    })
})

const getDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-recommendation')
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const bodies: any[] = patient.body
    const diagnosis: any = bodies.find((body: IBody) => body.idx === idx)
    if (!diagnosis) return res.status(404).json(DIAG_NOT_EXIST)

    res.status(200).json({
        ...SUCCESS,
        diagnosis
    })
})

const getAllOpthalPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await fetchPatients('-body')
    const opthals: any[] = patients.filter((opthal: any) => opthal.recommendation.opthalmology.eligible === true)

    res.status(200).json({
        ...SUCCESS,
        length: opthals.length,
        patients: sortByCardNumbers(opthals)
    })
})

const getAllPhysioPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await fetchPatients('-body')
    const physios: any[] = patients.filter((physio: any) => physio.recommendation.physiotherapy.eligible === true)

    res.status(200).json({
        ...SUCCESS,
        length: physios.length,
        patients: sortByCardNumbers(physios)
    })
})

const getDeadPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await fetchPatients('-body')

    const deads: any[] = patients.filter((dead: any) => {
        let obj: any
        if (dead.death.dead === true) {
            const { fullname, age, card_no, address, phone_no }: any = dead
            obj = {
                fullname, age, card_no,
                phone_no, address,
                date_vist: dead.date,
                date: dead.death.date
            }
        }
        return obj
    })

    res.status(200).json({
        ...SUCCESS,
        length: deads.length,
        deaths: sortByDates(deads)
    })
})

const getAllExtensions = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await fetchPatients('-body')

    const all: any[] = patients.map((ext: any) => {
        let obj: any
        const extensions: any[] = ext.recommendation.extensions
        if (extensions.length > 0) {
            obj = {
                fullname: ext.fullname,
                extensions: extensions,
                date: extensions[extensions.length - 1].date,
                card_no: ext.card_no,
                phone_no: ext.phone_no,
            }
        }
        return obj
    })

    res.status(200).json({
        ...SUCCESS,
        length: all.length,
        extensions: sortByDates(all)
    })
})

const getExtension = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const extensions: any[] = patient.recommendation.extensions

    res.status(200).json({
        ...SUCCESS,
        patient: {
            fullname: patient.fullname,
            card_no: patient.card_no,
            phone_no: patient.phone_no,
            address: patient.address
        },
        length: extensions.length,
        extensions: sortByDates(extensions)
    })
})

const getPhysioMedication = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const medications: any[] = patient.recommendation.physiotherapy.medication

    res.status(200).json({
        ...SUCCESS,
        length: medications.length,
        medications: sortByDates(medications)
    })
})

const getOpthalMedication = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await fetchByCardNumber(card_no, '-body')
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    const medications: any[] = patient.recommendation.opthalmology.medication

    res.status(200).json({
        ...SUCCESS,
        length: medications.length,
        medications: sortByDates(medications)
    })
})

export {
    allPatients, getAllDiagnosis, getExtension, getPhysioMedication,
    getDiagnosis, getPatient, getAllExtensions, getOpthalMedication,
    getDeadPatients, getAllOpthalPatients, getAllPhysioPatients
}