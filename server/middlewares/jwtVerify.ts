import jwt from 'jsonwebtoken'
import User from '../models/User'
import { Response, NextFunction } from 'express'
import checkRoles from '../utilities/checkRoles'
import { ACCESS_DENIED } from '../utilities/modal'
const asyncHandler = require('express-async-handler')

const jwtVerify = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader?.startsWith('Bearer')) return res.status(401).json(ACCESS_DENIED)

    const token: any = authHeader?.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json(ACCESS_DENIED)

            const account: any = await User.findOne({ token }).exec()

            const authRoles: any = account?.roles
            const user: string = decoded.userData.user
            const roles: string[] = decoded.userData.roles

            if (!account || account?.resigned || !checkRoles(authRoles, roles))  return res.status(403).json(ACCESS_DENIED)
            
            req.user = user
            req.roles = roles
            next()
        }
    )
})

export default jwtVerify