import Patient from '../models/Patient'
import { Request, Response } from 'express'
import { PATIENT_NOT_EXIST, SUCCESS } from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const allPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await Patient.find().select('-body -recommendation').exec()
    console.log(patients)
    res.status(200).json({
        ...SUCCESS,
        patients
    })
})

const getAllDiagnosis = asyncHandler(async (req: Request, res: Response) => {
    const { card_no }: any = req.params
    const patient: any = await Patient.findOne({ card_no })
    if (!patient) return res.status(400).json(PATIENT_NOT_EXIST)

    res.status(200).json({
        ...SUCCESS,
        diagnosis: patient.body
    })
})

export { allPatients, getAllDiagnosis }