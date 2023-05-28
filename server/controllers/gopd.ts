import { IBody } from '../type'
import Patient from '../models/Patient'
import { Request, Response } from 'express'
import {
    PATIENT_NOT_EXIST, SUCCESS,
    DIAG_NOT_EXIST
} from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const allPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await Patient.find()
    .select('-body -recommendation').exec()

    res.status(200).json({
        ...SUCCESS,
        patients: patients.reverse()
    })
})

const getPatient = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await Patient.findOne({ card_no })
    .select('-body -recommendation').exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    res.status(200).json({
        ...SUCCESS,
        patient
    })
})

const getAllDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await Patient.findOne({ card_no })
    .select('-recommendation').exec()
    if (!patient) return res.status(404).json(PATIENT_NOT_EXIST)

    res.status(200).json({
        ...SUCCESS,
        length: patient.body.length,
        diagnosis: patient.body.reverse()
    })
})

const getDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no, idx }: any = req.params
    const patient: any = await Patient.findOne({ card_no })
    .select('-recommendation').exec()
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
    const patients: any = await Patient.find().select('-body').exec()
    const opthals: any[] = patients.filter((opthal: any) => opthal.recommendation.opthalmology.eligible === true)

    res.status(200).json({
        ...SUCCESS,
        length: opthals.length,
        patients: opthals.reverse()
    })
})

const getAllPhysioPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await Patient.find().select('-body').exec()
    const physios: any[] = patients.filter((physio: any) => physio.recommendation.physiotherapy.eligible === true)

    res.status(200).json({
        ...SUCCESS,
        length: physios.length,
        patients: physios.reverse()
    })
})

const getDeadPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await Patient.find()
    .select('-body -recommendation').exec()
    const deads: any[] = patients.filter((dead: any) => dead.death.dead === true)

    res.status(200).json({
        ...SUCCESS,
        length: deads.length,
        deaths: deads
    })
})

export {
    allPatients, getAllDiagnosis,
    getDiagnosis, getPatient,
    getDeadPatients, getAllOpthalPatients, getAllPhysioPatients
}