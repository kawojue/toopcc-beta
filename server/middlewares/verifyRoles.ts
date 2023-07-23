import { IRequest } from '../type'
import checkRoles from '../utilities/checkRoles'
import { Response, NextFunction } from 'express'
import { ACCESS_DENIED } from '../utilities/modal'

const verifyRoles = (...roles: string[]) => {
    return (req: IRequest, res: Response, next: NextFunction) => {
        if (!req?.roles) return res.status(401).json(ACCESS_DENIED)

        const authRoles: string[] = req.roles
        const allowedRoles: string[] = [...roles]
        if (!checkRoles(authRoles, allowedRoles)) return res.status(401).json(ACCESS_DENIED)

        next()
    }
}

export default verifyRoles