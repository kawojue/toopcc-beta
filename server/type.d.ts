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

interface ICloud {
    secure_url: string
    public_id: string
}

interface IBody {
    idx: string
    diagnosis: {
        images: ICloud[]
        texts: string
    }
    date_visit: string
}

export {
    IMailer, IGenOTP,
    ILimiter, ICloud,
    IBody, IRequest
}