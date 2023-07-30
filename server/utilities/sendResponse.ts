import { Response } from 'express'

const sendError = (res: Response, statusCode: number, msg: string) => {
    res.status(statusCode).json({ success: false, msg })
    return
}

const sendSuccess = (res: Response, statusCode: number, data?: any) => {
    res.status(statusCode).json({ success: true, ...data })
    return
}

export { sendError, sendSuccess }