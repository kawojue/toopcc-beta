import { Response, NextFunction } from 'express'
import { ACCESS_DENIED } from '../utilities/error'

const verifyRoles = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req?.roles) return res.status(401).json(ACCESS_DENIED)

        const authRoles: string[] = req.roles
        const allowedRoles: string[] = [...roles]

        const result: any = allowedRoles.map((role: string) => authRoles.includes(role)).find((value: boolean) => value === true)
        if (!result) return res.status(401).json(ACCESS_DENIED)
        
        next()
    }
}

export default verifyRoles