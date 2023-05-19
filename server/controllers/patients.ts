import Patient from '../models/BasicPt'
import { Request, Response } from 'express'
import AltPatient from '../models/AdvancePt'
import full_name from '../utilities/full_name'
import {
    ERROR, FIELDS_REQUIRED, WARNING, SUCCESS
} from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const phoneRegex: RegExp = /^\d{11}$/

const add = asyncHandler(async (req: Request, res: Response) => {
    let { card_no, fullname, sex, phone_no, address, age }: any = req.body

    age = Number(age)
    card_no = card_no?.trim()
    address = address?.trim()
    fullname = full_name(fullname)

    if (!card_no || !fullname || !sex || !age) return res.status(400).json(FIELDS_REQUIRED)
    
    if (!phoneRegex.test(phone_no?.trim())) {
        return res.status(400).json({
            ...ERROR,
            msg: "Invalid phone number"
        })
    }

    if (age > 120) {
        return res.status(400).json({
            ...ERROR,
            msg: "Invalid age"
        })
    }

    const patient: any = await Patient.findOne({ card_no })
    if (patient) {
        return res.status(409).json({
            ...WARNING,
            msg: "Patient already exists."
        })
    }

    await Patient.create({
        sex,
        card_no,
        address,
        fullname,
        phone_no,
        age: age as number,
    })

    res.status(200).json({
        ...SUCCESS,
        msg: "Saved."
    })
})

const edit = asyncHandler(async (req: Request, res: Response) => {
    let { card_no, fullname, sex, phone_no, address, age }: any = req.body
})

export { add }