import bcrypt from 'bcrypt'
import User from '../models/User'
import randomString from 'randomstring'
import mailer from '../utilities/mailer'
import genOTP from '../utilities/genOTP'
import { IMailer, IGenOTP } from '../type'
import { Request, Response } from 'express'
import genToken from '../utilities/genToken'
import full_name from '../utilities/full_name'
import {
    CURRENT_PSWD, INCORRECT_PSWD, PSWD_CHANGED, SMTH_WENT_WRONG,
    FIELDS_REQUIRED, INVALID_EMAIL, ACCESS_DENIED, SUCCESS,
    PSWD_NOT_MATCH, ACCOUNT_NOT_FOUND, ERROR, WARNING,
} from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USER_REGEX: RegExp = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/

// handle account creation
const createUser = asyncHandler(async (req: any, res: Response) => {
    let user: any
    let { email, pswd, pswd2, fullname }: any = req.body
    email = email?.toLowerCase()?.trim()
    fullname = full_name(fullname)

    if (!email || !pswd || !pswd2 || !fullname) return res.status(400).json(FIELDS_REQUIRED)

    if (pswd !== pswd2) return res.status(400).json(PSWD_NOT_MATCH)

    if (EMAIL_REGEX.test(email) === false) return res.status(400).json(INVALID_EMAIL)

    user = email.split('@')[0]
    const account: any = await User.findOne({ 'mail.email': email }).exec()

    if (account) {
        return res.status(409).json({
            ...WARNING,
            msg: "Account already exists."
        })
    }

    const isUserExists: any = await User.findOne({ user }).exec()

    if (!USER_REGEX.test(user) || isUserExists) {
        const rand: string = randomString.generate({
            length: parseInt('657'[Math.floor(Math.random() * 3)]),
            charset: 'alphabetic'
        }) as string
        user = rand?.toLowerCase()?.trim()
    }

    const salt: string = await bcrypt.genSalt(10)
    pswd = await bcrypt.hash(pswd, salt)

    await User.create({
        user,
        password: pswd as string,
        fullname: fullname as string,
        'mail.email': email as string
    })

    res.status(201).json({
        ...SUCCESS,
        msg: "Account creation was successful."
    })
})

// handle Login
const login = asyncHandler(async (req: Request, res: Response) => {
    let { userId, pswd }: any = req.body
    userId = userId?.toLowerCase()?.trim()

    if (!userId || !pswd) return res.status(400).json(FIELDS_REQUIRED)

    const account: any = await User.findOne(
        EMAIL_REGEX.test(userId) ?
            { 'mail.email': userId } : { user: userId }
    ).exec()

    if (!account) {
        return res.status(400).json({
            ...WARNING,
            msg: "Invalid User ID or Password."
        })
    }

    if (account.resigned.resign) return res.status(401).json(ACCESS_DENIED)

    const match: boolean = await bcrypt.compare(pswd, account.password)
    if (!match) return res.status(401).json(INCORRECT_PSWD)

    const token = genToken(account.user, account.roles)

    account.token = token
    account.lastLogin = `${new Date()}`
    await account.save()

    res.status(200).json({
        token,
        ...SUCCESS,
        msg: "Login successful.",
    })
})

// send otp to user
const otpHandler = asyncHandler(async (req: Request, res: Response) => {
    let { email }: any = req.body
    email = email?.trim()?.toLowerCase()

    const { totp, totpDate }: IGenOTP = genOTP()

    if (!email) return res.status(400).json(INVALID_EMAIL)

    const account: any = await User.findOne({ 'mail.email': email }).exec()
    if (!account) {
        return res.status(400).json({
            ...ERROR,
            msg: "There is no account associated with this email."
        })
    }

    if (account.resigned.resign) return res.status(401).json(ACCESS_DENIED)

    account.OTP.totp = totp
    account.OTP.totpDate = totpDate
    account.mail.verified = false
    await account.save()

    const transportMail: IMailer = {
        senderName: "Admin at TOOPCC",
        to: email,
        subject: "Verification Code",
        text: `Code: ${totp}\nIf you did not request for this OTP. Please, ignore.`
    }

    const sendMail: boolean = await mailer(transportMail)
    if (!sendMail) return res.status(400).json(INVALID_EMAIL)

    res.status(200).json({
        ...SUCCESS,
        msg: "OTP has been sent to your email."
    })
})

// change username
const editUsername = asyncHandler(async (req: any, res: Response) => {
    let { newUser }: any = req.body
    newUser = newUser?.trim()?.toLowerCase()

    if (!newUser) return res.status(400).json(FIELDS_REQUIRED)

    if (!USER_REGEX.test(newUser)) {
        return res.status(400).json({
            ...WARNING,
            msg: "Username is not allowed."
        })
    }

    const account: any = await User.findOne({ user: req?.user }).exec()
    if (!account) return res.status(404).json(SMTH_WENT_WRONG)

    const userExists: any = await User.findOne({ user: newUser }).exec()
    if (userExists) {
        return res.status(409).json({
            ...WARNING,
            msg: "Username has been taken."
        })
    }

    account.token = ""
    account.user = newUser
    await account.save()

    res.status(200).json({
        ...SUCCESS,
        msg: "You've successfully changed your username."
    })
})

const editFullname = asyncHandler(async (req: any, res: Response) => {
    let { fullname }: any = req.body
    fullname = full_name(fullname)

    if (!fullname) return res.status(400).json(FIELDS_REQUIRED)

    const account: any = await User.findOne({ user: req?.user }).exec()
    if (!account) return res.status(404).json(SMTH_WENT_WRONG)

    account.fullname = fullname
    await account.save()

    res.status(200).json({
        ...SUCCESS,
        msg: "You've successfully changed your full name."
    })
})

const logout = asyncHandler(async (req: any, res: Response) => {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.sendStatus(204)
    }

    const token: string = authHeader.split(' ')[1]
    const account: any = await User.findOne({ token }).exec()

    if (!account) {
        return res.sendStatus(204)
    }

    account.token = ""
    await account.save()

    res.sendStatus(204)
})

// verify OTP
const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { otp, email }: any = req.body

    if (!otp || !email) return res.status(400).json(FIELDS_REQUIRED)

    const account: any = await User.findOne({ 'mail.email': email }).exec()
    const totp: string = account.OTP.totp
    const totpDate: number = account.OTP.totpDate
    const expiry: number = totpDate + (60 * 60 * 1000) // after 1hr

    if (expiry < Date.now()) {
        account.OTP = {}
        await account.save()
        return res.status(400).json({
            ...WARNING,
            msg: "OTP Expired."
        })
    }

    if (totp !== otp) {
        return res.status(401).json({
            ...ERROR,
            msg: "Incorrect OTP"
        })
    }

    account.OTP = {}
    account.mail.verified = true
    await account.save()

    res.status(200).json({
        verified: true,
        email,
        user: account.user
    })
})

// reset password
const resetpswd = asyncHandler(async (req: Request, res: Response) => {
    const { verified, email, newPswd, newPswd2 }: any = req.body

    if (!email || !newPswd) return res.status(400).json(FIELDS_REQUIRED)

    if (newPswd !== newPswd2) return res.status(400).json(PSWD_NOT_MATCH)

    const account: any = await User.findOne({ 'mail.email': email }).exec()
    if (!account) return res.status(404).json(ACCOUNT_NOT_FOUND)

    if (!verified || !account.mail.verified || account.resigned.resign) return res.status(400).json(ACCESS_DENIED)

    const compare = await bcrypt.compare(newPswd, account.password)
    if (compare) return res.status(400).json(CURRENT_PSWD)

    const salt: string = await bcrypt.genSalt(10)
    const hasedPswd: string = await bcrypt.hash(newPswd, salt)

    account.token = ""
    account.password = hasedPswd
    account.mail.verified = false
    await account.save()

    res.status(200).json(PSWD_CHANGED)
})

const editPassword = asyncHandler(async (req: any, res: Response) => {
    const { currentPswd, pswd, pswd2 }: any = req.body

    if (!currentPswd || !pswd || !pswd2) return res.status(400).json(FIELDS_REQUIRED)

    if (!currentPswd) {
        return res.status(400).json({
            ...ERROR,
            msg: 'Old password is required.'
        })
    }

    if (pswd !== pswd2) return res.status(400).json(PSWD_NOT_MATCH)

    if (currentPswd === pswd) return res.status(400).json(CURRENT_PSWD)

    const account: any = await User.findOne({ user: req?.user }).exec()
    if (!account) return res.status(404).json(SMTH_WENT_WRONG)

    const isMatch = await bcrypt.compare(currentPswd, account.password)
    if (!isMatch) return res.status(401).json(INCORRECT_PSWD)

    const salt: string = await bcrypt.genSalt(10)
    const hashedPswd: string = await bcrypt.hash(pswd, salt)

    account.token = ""
    account.password = hashedPswd
    await account.save()

    res.status(200).json(PSWD_CHANGED)
})


export {
    resetpswd, login, otpHandler,
    createUser, logout, verifyOTP,
    editPassword, editUsername, editFullname
}