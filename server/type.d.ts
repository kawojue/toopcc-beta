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

interface IBody {
    idx: string
    date: string
    next_app?: string
    diagnosis: Diagnosis[]
}

interface Diagnosis {
    texts?: string
    images: Images[]
}

interface Images {
    secure_url?: string
    public_id?: string
}

export {
    IMailer, IGenOTP,
    ILimiter, IBody,
    IRequest, Images
}