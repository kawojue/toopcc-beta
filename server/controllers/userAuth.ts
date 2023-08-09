import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import {
    sendError, sendSuccess
} from '../utilities/sendResponse'
import randomString from 'randomstring'
import mailer from '../utilities/mailer'
import genOTP from '../utilities/genOTP'
import handleFile from '../utilities/file'
import { Request, Response } from 'express'
import genToken from '../utilities/genToken'
import full_name from '../utilities/full_name'
import {
    findByEmail, findByToken, findByUser, User
} from '../utilities/model'
import StatusCodes from '../utilities/StatusCodes'
import { IMailer, IGenOTP, IRequest } from '../type'
import { uploadS3, deleteS3, getS3 } from '../utilities/s3'
import {
    PSWD_NOT_MATCH, ACCOUNT_NOT_FOUND, ROLES_UPDATED,
    FIELDS_REQUIRED, INVALID_EMAIL, ACCESS_DENIED, CANCELED,
    CURRENT_PSWD, INCORRECT_PSWD, PSWD_CHANGED, SMTH_WENT_WRONG,
} from '../utilities/modal'
const expressAsyncHandler = require('express-async-handler')

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USER_REGEX: RegExp = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/

// handle account creation
const createUser = expressAsyncHandler(async (req: IRequest, res: Response) => {
    let url: any
    let user: any
    let path: any
    let { email, pswd, pswd2, fullname } = req.body

    if (!email || !pswd || !pswd2 || !fullname) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    fullname = full_name(fullname)
    email = email?.toLowerCase()?.trim()

    if (pswd !== pswd2) {
        sendError(res, StatusCodes.BadRequest, PSWD_NOT_MATCH)
        return
    }

    if (EMAIL_REGEX.test(email) === false) {
        sendError(res, StatusCodes.BadRequest, INVALID_EMAIL)
        return
    }

    user = email.split('@')[0]
    const account = await findByEmail(email)
    if (account) {
        sendError(res, StatusCodes.Conflict, "Account already exists.")
        return
    }

    const userExists = await findByUser(user)
    if (!USER_REGEX.test(user) || userExists) {
        const rand: string = randomString.generate({
            length: parseInt('657'[Math.floor(Math.random() * 3)]),
            charset: 'alphabetic'
        })
        user = rand?.toLowerCase()?.trim()
    }

    const salt: string = await bcrypt.genSalt(10)
    pswd = await bcrypt.hash(pswd, salt)

    if (req.file) {
        const file = handleFile(res, req.file)
        path = `Staffs/Avatar/${uuid()}.${file.extension}`
        try {
            await uploadS3(file.buffer, path, file.mimetype)
            url = await getS3(path)
        } catch {
            sendError(res, StatusCodes.BadRequest, SMTH_WENT_WRONG)
            // but proceed with account creation
        }
    }

    await User.create({
        user,
        email,
        fullname,
        password: pswd,
        avatar: { url, path },
    })

    sendSuccess(res, StatusCodes.Created, { msg: "Account creation was successful." })
})

// handle Login
const login = expressAsyncHandler(async (req: Request, res: Response) => {
    let { userId, pswd } = req.body
    userId = userId?.toLowerCase()?.trim()

    if (!userId || !pswd) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    const account = EMAIL_REGEX.test(userId) ? await findByEmail(userId) : await findByUser(userId)
    if (!account) {
        sendError(res, StatusCodes.BadRequest, "Invalid User ID or Password.")
        return
    }

    if (account.resigned?.resign) {
        sendError(res, StatusCodes.Unauthorized, ACCESS_DENIED)
        return
    }

    const match: boolean = await bcrypt.compare(pswd, account.password)
    if (!match) {
        sendError(res, StatusCodes.Unauthorized, INCORRECT_PSWD)
        return
    }

    const token: string = genToken(account.user, account.roles)

    account.token = token
    account.lastLogin = `${new Date().toISOString()}`
    await account.save()

    sendSuccess(res, StatusCodes.OK, {
        token,
        msg: "Login successful."
    })
})

// send otp to user
const otpHandler = expressAsyncHandler(async (req: Request, res: Response) => {
    let { email } = req.body
    email = email?.trim()?.toLowerCase()

    const { totp, totpDate }: IGenOTP = genOTP()

    if (!email) {
        sendError(res, StatusCodes.BadRequest, INVALID_EMAIL)
        return
    }

    const account = await findByEmail(email)
    if (!account) {
        sendError(res, StatusCodes.NotFound, "There is no account associated with this email.")
        return
    }

    if (account.resigned?.resign) {
        sendError(res, StatusCodes.Unauthorized, ACCESS_DENIED)
        return
    }

    const transportMail: IMailer = {
        senderName: "Admin at TOOPCC",
        to: email,
        subject: "Verification Code",
        text: `Code: ${totp}\nIf you did not request for this OTP. Please, ignore.`
    }

    const sendMail: boolean = await mailer(transportMail)
    if (!sendMail) {
        sendError(res, StatusCodes.BadRequest, INVALID_EMAIL)
        return
    }

    account.totp = totp
    account.totp_date = totpDate
    account.email_verified = false
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: "OTP has been sent to your email." })
})

// change username
const editUsername = expressAsyncHandler(async (req: IRequest, res: Response) => {
    let { newUser } = req.body
    newUser = newUser?.trim()?.toLowerCase()

    if (!newUser) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    if (!USER_REGEX.test(newUser)) {
        sendError(res, StatusCodes.BadRequest, "Username is not allowed.")
        return
    }

    const account = await findByUser(req.user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, SMTH_WENT_WRONG)
        return
    }

    const userExists = await findByUser(newUser)
    if (userExists) {
        sendError(res, StatusCodes.Conflict, "Username has been taken.")
        return
    }

    account.token = ""
    account.user = newUser
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: "You've successfully changed your username." })
})

const editFullname = expressAsyncHandler(async (req: IRequest, res: Response) => {
    let { fullname } = req.body
    fullname = full_name(fullname)

    if (!fullname) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    const account = await findByUser(req.user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, SMTH_WENT_WRONG)
        return
    }

    account.fullname = fullname
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: "You've successfully changed your fullname." })
})

const logout = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.sendStatus(StatusCodes.NoContent)
    }

    const token: string = authHeader.split(' ')[1]
    const account = await findByToken(token)
    if (!account) {
        return res.sendStatus(StatusCodes.NoContent)
    }

    account.token = ""
    await account.save()

    res.sendStatus(StatusCodes.NoContent)
})

// verify OTP
const verifyOTP = expressAsyncHandler(async (req: Request, res: Response) => {
    const { otp, email } = req.body

    if (!otp || !email) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    const account = await findByEmail(email)
    if (!account) {
        sendError(res, StatusCodes.NotFound, SMTH_WENT_WRONG)
        return
    }

    const totp: string = account.totp
    const totpDate: number = account.totp_date
    const expiry: number = totpDate + (60 * 60 * 1000) // after 1hr

    if (expiry < Date.now()) {
        account.totp = ""
        account.totp_date = null
        account.email_verified = false

        sendError(res, StatusCodes.BadRequest, "OTP has expired.")
        return
    }

    if (totp !== otp) {
        sendError(res, StatusCodes.Unauthorized, "Incorrecr OTP")
        return
    }

    account.totp = ""
    account.totp_date = null
    account.email_verified = false
    await account.save()

    sendSuccess(res, StatusCodes.OK, {
        email,
        verified: true,
        user: account.user
    })
})

// reset password
const resetpswd = expressAsyncHandler(async (req: Request, res: Response) => {
    const { verified, email, newPswd, newPswd2 } = req.body

    if (!email || !newPswd) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    if (newPswd !== newPswd2) {
        sendError(res, StatusCodes.BadRequest, PSWD_NOT_MATCH)
        return
    }

    const account = await findByEmail(email)
    if (!account) {
        sendError(res, StatusCodes.NotFound, ACCOUNT_NOT_FOUND)
        return
    }

    if (!verified || !account.email_verified || account.resigned?.resign) {
        sendError(res, StatusCodes.Unauthorized, ACCESS_DENIED)
        return
    }

    const compare = await bcrypt.compare(newPswd, account.password)
    if (compare) {
        sendError(res, StatusCodes.BadRequest, CURRENT_PSWD)
        return
    }

    const salt: string = await bcrypt.genSalt(10)
    const hashedPswd: string = await bcrypt.hash(newPswd, salt)

    account.token = ""
    account.password = hashedPswd
    account.email_verified = false
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: PSWD_CHANGED })
})

const editPassword = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const { currentPswd, pswd, pswd2 } = req.body

    if (!currentPswd || !pswd || !pswd2) {
        sendError(res, StatusCodes.BadRequest, FIELDS_REQUIRED)
        return
    }

    if (!currentPswd) {
        sendError(res, StatusCodes.BadRequest, "Old password is required.")
        return
    }

    if (pswd !== pswd2) {
        sendError(res, StatusCodes.BadRequest, PSWD_NOT_MATCH)
        return
    }

    if (currentPswd === pswd) {
        sendError(res, StatusCodes.BadRequest, CURRENT_PSWD)
        return
    }

    const account = await findByUser(req.user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, SMTH_WENT_WRONG)
        return
    }

    const isMatch = await bcrypt.compare(currentPswd, account.password)
    if (!isMatch) {
        sendError(res, StatusCodes.Unauthorized, INCORRECT_PSWD)
        return
    }

    const salt: string = await bcrypt.genSalt(10)
    const hashedPswd: string = await bcrypt.hash(pswd, salt)

    account.token = ""
    account.password = hashedPswd
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: PSWD_CHANGED })
})

const changeAvatar = expressAsyncHandler(async (req: IRequest, res: any) => {
    const file = handleFile(res, req.file)

    const account = await findByUser(req.user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, SMTH_WENT_WRONG)
        return
    }

    if (account.avatar_path) {
        try {
            await deleteS3(account.avatar_path)
            account.avatar_path = ""
        } catch {
            sendError(res, StatusCodes.BadRequest, SMTH_WENT_WRONG)
            return
        }
    }

    const path = `Staffs/Avatar/${uuid()}.${file.extension}`
    try {
        await uploadS3(file.buffer, path, file.mimetype)
        account.avatar = {
            path,
            url: await getS3(path)
        }
    } catch {
        sendError(res, StatusCodes.BadRequest, SMTH_WENT_WRONG)
        return
    }

    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: "Successful." })
})

const deleteAvatar = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const account = await findByUser(req.user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, SMTH_WENT_WRONG)
        return
    }

    try {
        await deleteS3(account.avatar?.path)
    } catch {
        sendError(res, StatusCodes.BadRequest, SMTH_WENT_WRONG)
        return
    }

    account.avatar = {
        url: "",
        path: "",
    }
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: "Successful." })
})

const resigned = expressAsyncHandler(async (req: Request, res: Response) => {
    const { user } = req.params
    const { resign, date } = req.body

    const account = await findByUser(user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, ACCOUNT_NOT_FOUND)
        return
    }

    if (Boolean(resign) === false) {
        account.resigned = {
            date: "",
            resign: false
        }
    }

    if (Boolean(resign) === true && !date) {
        account.resigned = {
            date: `${new Date().toISOString()}`,
            resign: true
        }
    }

    account.resigned = { date, resign }
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: "Staff has been resigned." })
})

const editRoles = expressAsyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body
    const { type } = req.query
    const { user } = req.params

    if (!role) {
        sendError(res, StatusCodes.BadRequest, CANCELED)
        return
    }

    const account = await findByUser(user)
    if (!account) {
        sendError(res, StatusCodes.NotFound, ACCOUNT_NOT_FOUND)
        return
    }

    const roles: string[] = account.roles
    if (type === "assign") {
        if (roles.includes(role)) {
            sendSuccess(res, StatusCodes.OK, "Existing Role.")
            return
        }

        roles.push(role)
        account.roles = roles
    }

    if (type === "remove") {
        if (!roles.includes(role)) {
            sendError(res, StatusCodes.NotFound, "Role does not exist.")
            return
        }

        const newRoles: string[] = roles.filter((authRole: string) => authRole !== role)
        if (newRoles.length === 0) {
            sendError(res, StatusCodes.BadRequest, "Empty role! Cannot remove role.")
            return
        }

        account.roles = newRoles
    }

    account.token = ""
    await account.save()

    sendSuccess(res, StatusCodes.OK, { msg: ROLES_UPDATED })
})


export {
    resetpswd, login, otpHandler, deleteAvatar, createUser, logout, verifyOTP,
    changeAvatar, editPassword, editUsername, editFullname, resigned, editRoles
}