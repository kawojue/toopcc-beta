import type { Request } from 'express'

interface IRequest extends Request {
    user: string
    roles: string[]
}

interface IMailer {
    senderName: string
    to: string
    subject: string
    text: string
}

interface IGenOTP {
    totp: string
    totpDate: number
}

interface ILimiter {
    max: number
    timerArr: number[]
    msg?: string
}

export {
    IMailer, IGenOTP,
    ILimiter, IRequest,
}