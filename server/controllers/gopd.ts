import Patient from '../models/Patient'
import { Request, Response } from 'express'
import { SUCCESS } from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const allPatients = asyncHandler(async (req: Request, res: Response) => {
    const patients: any = await Patient.find().select('-body -recommendation').exec()
    console.log(patients)
    res.status(200).json({
        ...SUCCESS,
        patients
    })
})

export { allPatients }