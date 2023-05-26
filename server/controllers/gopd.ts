import Patient from '../models/Patient'
import { Request, Response } from 'express'
const asyncHandler = require('express-async-handler')

const all = asyncHandler(async (req: Request, res: Response) => {
    const patients = await Patient.find().exec()
    res.status(200).json({
        patients
    })
})

export { all }