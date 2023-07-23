import bcrypt from 'bcrypt'
import prisma from '../prisma'
import randomString from 'randomstring'
import mailer from '../utilities/mailer'
import genOTP from '../utilities/genOTP'
import { IMailer, IGenOTP } from '../type'
import { Request, Response } from 'express'
import genToken from '../utilities/genToken'
import cloudinary from '../configs/cloudinary'
import full_name from '../utilities/full_name'
import StatusCodes from '../utilities/StatusCodes'
import {
    CURRENT_PSWD, INCORRECT_PSWD, PSWD_CHANGED, SMTH_WENT_WRONG,
    FIELDS_REQUIRED, INVALID_EMAIL, ACCESS_DENIED, SUCCESS,
    PSWD_NOT_MATCH, ACCOUNT_NOT_FOUND, ERROR, CANCELED, ROLES_UPDATED,
} from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USER_REGEX: RegExp = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/

// handle account creation
const createUser = asyncHandler(async (req: any, res: Response) => {
    let user: any
    let result: any
    let { email, pswd, pswd2, fullname, avatar }: any = req.body

    if (!email || !pswd || !pswd2 || !fullname) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    fullname = full_name(fullname)
    email = email?.toLowerCase()?.trim()

    if (pswd !== pswd2) {
        return res.status(StatusCodes.BadRequest).json(PSWD_NOT_MATCH)
    }

    if (EMAIL_REGEX.test(email) === false) {
        return res.status(StatusCodes.BadRequest).json(INVALID_EMAIL)
    }

    user = email.split('@')[0]
    const account = await prisma.user.findUnique({
        where: {
            mail: { email }
        }
    })

    if (account) {
        return res.status(StatusCodes.Conflict).json({
            ...ERROR,
            msg: "Account already exists."
        })
    }

    const isUserExists: any = await prisma.user.findUnique({
        where: { user }
    })

    if (!USER_REGEX.test(user) || isUserExists) {
        const rand: string = randomString.generate({
            length: parseInt('657'[Math.floor(Math.random() * 3)]),
            charset: 'alphabetic'
        }) as string
        user = rand?.toLowerCase()?.trim()
    }

    const salt: string = await bcrypt.genSalt(10)
    pswd = await bcrypt.hash(pswd, salt)

    if (avatar) {
        result = await cloudinary.uploader.upload(avatar, {
            folder: `TOOPCC/Staffs/Avatars`,
            resource_type: 'image'
        })

        if (!result) {
            return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
        }
    }

    await prisma.user.create({
        data: {
            user,
            fullname,
            password: pswd,
            mail: { email },
            avatar: {
                secure_url: result?.secure_url,
                public_id: result?.public_id
            }
        }
    })

    res.status(StatusCodes.Created).json({
        ...SUCCESS,
        msg: "Account creation was successful."
    })
})

// handle Login
const login = asyncHandler(async (req: Request, res: Response) => {
    let { userId, pswd }: any = req.body
    userId = userId?.toLowerCase()?.trim()

    if (!userId || !pswd) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    const account = EMAIL_REGEX.test(userId) ?
        await prisma.user.findUnique({
            where: {
                mail: {
                    email: userId
                }
            }
        }) : await prisma.user.findUnique({
            where: {
                user: userId
            }
        })

    if (!account) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "Invalid User ID or Password."
        })
    }

    if (account.resigned?.resign) {
        return res.status(StatusCodes.Unauthorized).json(ACCESS_DENIED)
    }

    const match: boolean = await bcrypt.compare(pswd, account.password)
    if (!match) {
        return res.status(StatusCodes.Unauthorized).json(INCORRECT_PSWD)
    }

    const token: string = genToken(account.user, account.roles)

    await prisma.user.update({
        where: {
            user: account.user
        },
        data: {
            token,
            lastLogin: `${new Date()}`
        }
    })

    res.status(StatusCodes.OK).json({
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

    if (!email) {
        return res.status(StatusCodes.BadRequest).json(INVALID_EMAIL)
    }

    const account = await prisma.user.findUnique({
        where: {
            mail: { email }
        }
    })

    if (!account) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "There is no account associated with this email."
        })
    }

    if (account.resigned?.resign) {
        return res.status(StatusCodes.Unauthorized).json(ACCESS_DENIED)
    }

    await prisma.user.update({
        where: {
            user: account.user
        },
        data: {
            otp: {
                totp,
                totpDate
            },
            mail: {
                verified: false
            }
        }
    })

    const transportMail: IMailer = {
        senderName: "Admin at TOOPCC",
        to: email,
        subject: "Verification Code",
        text: `Code: ${totp}\nIf you did not request for this OTP. Please, ignore.`
    }

    const sendMail: boolean = await mailer(transportMail)
    if (!sendMail) {
        return res.status(StatusCodes.BadRequest).json(INVALID_EMAIL)
    }

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "OTP has been sent to your email."
    })
})

// change username
const editUsername = asyncHandler(async (req: any, res: Response) => {
    let { newUser }: any = req.body
    newUser = newUser?.trim()?.toLowerCase()

    if (!newUser) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    if (!USER_REGEX.test(newUser)) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "Username is not allowed."
        })
    }

    const account = await prisma.user.findUnique({
        where: {
            user: req?.user
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
    }

    const userExists: any = await prisma.user.findUnique({
        where: {
            user: newUser
        }
    })

    if (userExists) {
        return res.status(StatusCodes.Conflict).json({
            ...ERROR,
            msg: "Username has been taken."
        })
    }

    await prisma.user.update({
        where: {
            user: account.user
        },
        data: {
            token: "",
            user: newUser
        }
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "You've successfully changed your username."
    })
})

const editFullname = asyncHandler(async (req: any, res: Response) => {
    let { fullname }: any = req.body
    fullname = full_name(fullname)

    if (!fullname) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    const account = await prisma.user.findUnique({
        where: {
            user: req?.user
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
    }

    await prisma.user.update({
        where: {
            user: account.user
        },
        data: { fullname }
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "You've successfully changed your fullname."
    })
})

const logout = asyncHandler(async (req: any, res: Response) => {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.sendStatus(StatusCodes.NoContent)
    }

    const token: string = authHeader.split(' ')[1]
    const account = await prisma.user.findUnique({
        where: { token }
    })

    if (!account) {
        return res.sendStatus(StatusCodes.NoContent)
    }

    await prisma.user.update({
        where: { token },
        data: {
            token: ""
        }
    })

    res.sendStatus(StatusCodes.NoContent)
})

// verify OTP
const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { otp, email }: any = req.body

    if (!otp || !email) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    const account = await prisma.user.findUnique({
        where: {
            mail: { email }
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
    }

    const totp: string = account.otp?.totp as string
    const totpDate: number = account.otp?.totpDate as number
    const expiry: number = totpDate as number + (60 * 60 * 1000) // after 1hr

    if (expiry < Date.now()) {
        await prisma.user.update({
            where: {
                mail: { email }
            },
            data: {
                otp: {}
            }
        })

        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "OTP Expired."
        })
    }

    if (totp !== otp) {
        return res.status(StatusCodes.Unauthorized).json({
            ...ERROR,
            msg: "Incorrect OTP"
        })
    }

    await prisma.user.update({
        where: {
            mail: { email }
        },
        data: {
            otp: {},
            mail: {
                verified: true
            }
        }
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        email,
        verified: true,
        user: account.user
    })
})

// reset password
const resetpswd = asyncHandler(async (req: Request, res: Response) => {
    const { verified, email, newPswd, newPswd2 }: any = req.body

    if (!email || !newPswd) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    if (newPswd !== newPswd2) {
        return res.status(StatusCodes.BadRequest).json(PSWD_NOT_MATCH)
    }

    const account = await prisma.user.findUnique({
        where: {
            mail: { email }
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(ACCOUNT_NOT_FOUND)
    }

    if (!verified || !account.mail?.verified || account.resigned?.resign) {
        return res.status(StatusCodes.BadRequest).json(ACCESS_DENIED)
    }

    const compare = await bcrypt.compare(newPswd, account.password)
    if (compare) {
        return res.status(StatusCodes.BadRequest).json(CURRENT_PSWD)
    }

    const salt: string = await bcrypt.genSalt(10)
    const hasedPswd: string = await bcrypt.hash(newPswd, salt)

    await prisma.user.update({
        where: {
            mail: { email }
        },
        data: {
            token: "",
            password: hasedPswd,
            mail: {
                verified: false
            }
        }
    })

    res.status(StatusCodes.OK).json(PSWD_CHANGED)
})

const editPassword = asyncHandler(async (req: any, res: Response) => {
    const { currentPswd, pswd, pswd2 }: any = req.body

    if (!currentPswd || !pswd || !pswd2) {
        return res.status(StatusCodes.BadRequest).json(FIELDS_REQUIRED)
    }

    if (!currentPswd) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: 'Old password is required.'
        })
    }

    if (pswd !== pswd2) {
        return res.status(StatusCodes.BadRequest).json(PSWD_NOT_MATCH)
    }

    if (currentPswd === pswd) {
        return res.status(StatusCodes.BadRequest).json(CURRENT_PSWD)
    }

    const account = await prisma.user.findUnique({
        where: {
            user: req?.user
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
    }

    const isMatch = await bcrypt.compare(currentPswd, account.password)
    if (!isMatch) {
        return res.status(StatusCodes.Unauthorized).json(INCORRECT_PSWD)
    }

    const salt: string = await bcrypt.genSalt(10)
    const hashedPswd: string = await bcrypt.hash(pswd, salt)

    await prisma.user.update({
        where: {
            user: req?.user
        },
        data: {
            token: "",
            password: hashedPswd
        }
    })

    res.status(StatusCodes.OK).json(PSWD_CHANGED)
})

const changeAvatar = asyncHandler(async (req: any, res: any) => {
    const { avatar }: any = req.body
    if (!avatar) {
        return res.status(StatusCodes.BadRequest).json(SMTH_WENT_WRONG)
    }

    const account = await prisma.user.findUnique({
        where: {
            user: req?.user
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
    }

    if (account.avatar?.secure_url) {
        const res = await cloudinary.uploader.destroy(account.avatar?.public_id)
        if (!res) {
            return res.status(StatusCodes.BadRequest).json(SMTH_WENT_WRONG)
        }
    }

    const result = await cloudinary.uploader.upload(avatar, {
        folder: `TOOPCC/Staffs/Avatars`,
        resource_type: 'image'
    })

    if (!result) {
        return res.status(StatusCodes.BadRequest).json(SMTH_WENT_WRONG)
    }

    await prisma.user.update({
        where: {
            user: req?.user
        },
        data: {
            avatar: {
                secure_url: result.secure_url,
                public_id: result.public_id
            }
        }
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "Successful."
    })
})

const deleteAvatar = asyncHandler(async (req: any, res: Response) => {
    const account = await prisma.user.findUnique({
        where: {
            user: req?.user
        }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(SMTH_WENT_WRONG)
    }

    const result: any = await cloudinary.uploader.destroy(account.avatar?.public_id as string)
    if (!result) {
        return res.status(StatusCodes.BadRequest).json(SMTH_WENT_WRONG)
    }

    await prisma.user.update({
        where: {
            user: req?.user
        },
        data: {
            avatar: {
                secure_url: "",
                public_id: ""
            }
        }
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "Successful."
    })
})

const resigned = asyncHandler(async (req: Request, res: Response) => {
    const { user }: any = req.params
    const { resign, date }: any = req.body

    const account = await prisma.user.findUnique({
        where: { user }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(ACCOUNT_NOT_FOUND)
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
            resign: false
        }
    }

    account.resigned = {
        date,
        resign
    }
    await prisma.user.update({
        where: { user },
        data: account
    })

    res.status(StatusCodes.OK).json({
        ...SUCCESS,
        msg: "Staff has been resigned"
    })
})

const changeRoles = asyncHandler(async (req: Request, res: Response) => {
    const { role }: any = req.body
    const { user }: any = req.params
    if (!role) {
        return res.status(StatusCodes.BadRequest).json(CANCELED)
    }

    const account = await prisma.user.findUnique({
        where: { user }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(ACCOUNT_NOT_FOUND)
    }

    const roles: string[] = account.roles
    if (roles.includes(role)) {
        return res.status(StatusCodes.OK).json({
            ...SUCCESS,
            msg: "Existing roles"
        })
    }

    roles.push(role)
    await prisma.user.update({
        where: { user },
        data: {
            token: "",
            roles: roles
        }
    })

    res.status(StatusCodes.OK).json(ROLES_UPDATED)
})

const removeRole = asyncHandler(async (req: Request, res: Response) => {
    const { role }: any = req.body
    const { user }: any = req.params
    if (!role) {
        return res.status(StatusCodes.BadRequest).json(CANCELED)
    }

    const account = await prisma.user.findUnique({
        where: { user }
    })

    if (!account) {
        return res.status(StatusCodes.NotFound).json(ACCOUNT_NOT_FOUND)
    }

    const roles: string[] = account.roles
    if (!roles.includes(role)) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "Role does not exist."
        })
    }

    const newRoles: string[] = roles.filter((authRole: string) => authRole !== role)
    if (newRoles.length === 0) {
        return res.status(StatusCodes.BadRequest).json({
            ...ERROR,
            msg: "Empty role! Cannot remove role."
        })
    }

    await prisma.user.update({
        where: { user },
        data: {
            token: "",
            roles: newRoles
        }
    })

    res.status(StatusCodes.OK).json(ROLES_UPDATED)
})


export {
    resetpswd, login, otpHandler, deleteAvatar,
    createUser, logout, verifyOTP, changeAvatar,
    editPassword, editUsername, editFullname,
    resigned, changeRoles, removeRole
}