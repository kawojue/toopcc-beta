import checkRoles from '../utilities/checkRoles'
import { Response, NextFunction } from 'express'
import { ACCESS_DENIED } from '../utilities/modal'
import { sendError } from '../utilities/sendResponse'
import StatusCodes from '../utilities/StatusCodes'

const verifyRoles = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req?.roles) {
            sendError(res, StatusCodes.Unauthorized, ACCESS_DENIED)
            return
        }

        const authRoles: string[] = req.roles
        const allowedRoles: string[] = [...roles]
        if (!checkRoles(authRoles, allowedRoles)) {
            sendError(res, StatusCodes.Unauthorized, ACCESS_DENIED)
            return
        }

        next()
    }
}

export default verifyRoles