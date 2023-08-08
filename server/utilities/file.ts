import { Response } from 'express'
import StatusCodes from './StatusCodes'
import { sendError } from './sendResponse'

const handleFile = (res: Response, file: File): any => {
    const maxSize: number = 5242880
    const size: number = file.size
    if (size < maxSize) {
        const extension = file.originalname.split('.').pop()
        return { ...file, extension }
    } else {
        sendError(res, StatusCodes.PayloadTooLarge, 'Image size is too large < 5MB.')
        return
    }
}

export default handleFile