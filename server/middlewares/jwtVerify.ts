import jwt from 'jsonwebtoken'
import { IRequest } from '../type'
import { Response, NextFunction } from 'express'
import { fetchByToken } from '../utilities/model'
import StatusCodes from '../utilities/StatusCodes'
import { ACCESS_DENIED } from '../utilities/modal'
const expressAsyncHandler = require('express-async-handler')

const jwtVerify = expressAsyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        return res.status(StatusCodes.Unauthorized).json(ACCESS_DENIED)
    }

    const token: string = authHeader?.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) {
                return res.status(StatusCodes.Forbidden).json(ACCESS_DENIED)
            }

            const account = await fetchByToken(token)

            if (!account) {
                return res.status(StatusCodes.Forbidden).json(ACCESS_DENIED)
            }

            const user: string = decoded.user
            const roles: string[] = decoded.roles
            const authRoles: string[] = account.roles

            if (account.resigned?.resign || roles.length !== authRoles.length) {
                account.user = decoded.user
                account.token = ""
                await account.save()
                return res.status(StatusCodes.Forbidden).json(ACCESS_DENIED)
            }

            req.user = user
            req.roles = roles
            next()
        }
    )
})

export default jwtVerify