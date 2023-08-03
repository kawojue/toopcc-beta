import { Response } from 'express'
import StatusCodes from './StatusCodes'
import { sendError } from './sendResponse'

const handleFile = (res: Response, file: any) => {
    const maxSize: number = 5242880
    const size: number = file.size
    if (size < maxSize) {
        return file
    } else {
        sendError(res, StatusCodes.PayloadTooLarge, 'Image size is too large < 5MB.')
        return
    }
}

export default handleFile