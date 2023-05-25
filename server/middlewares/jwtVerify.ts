import jwt from 'jsonwebtoken'
import User from '../models/User'
import { Response, NextFunction } from 'express'
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

            if (!account) return res.status(403).json(ACCESS_DENIED)

            const user: string = decoded.user
            const roles: string[] = decoded.roles
            const authRoles: string[] = account.roles

            if (account.resigned.resign || roles.length !== authRoles.length) {
                account.token = ""
                await account.save()
                return res.status(403).json(ACCESS_DENIED)
            }
            
            req.user = user
            req.roles = roles
            next()
        }
    )
})

export default jwtVerify