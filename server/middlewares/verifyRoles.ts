import { ACCESS_DENIED } from '../configs/error'
import { Response, NextFunction } from 'express'

const verifyRoles = (role: string) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req?.roles) return res.status(401).json(ACCESS_DENIED)
        
        const roles: string[] = req.roles
        const validRole: boolean = roles.includes(role)
        if (!validRole) return res.status(401).json(ACCESS_DENIED)
        next()
    }
}

export default verifyRoles