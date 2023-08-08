import jwt from 'jsonwebtoken'
import { IRequest } from '../type'
import { Response, NextFunction } from 'express'
import { findByToken } from '../utilities/model'
import StatusCodes from '../utilities/StatusCodes'
import { ACCESS_DENIED } from '../utilities/modal'
import { sendError } from '../utilities/sendResponse'
const expressAsyncHandler = require('express-async-handler')

const jwtVerify = expressAsyncHandler(async (req: IRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization
    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        sendError(res, StatusCodes.Unauthorized, ACCESS_DENIED)
        return
    }

    const token: string = authHeader?.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT_SECRET!,
        async (err: any, decoded: any) => {
            if (err) {
                sendError(res, StatusCodes.Forbidden, ACCESS_DENIED)
                return
            }

            const account = await findByToken(token)
            if (!account) {
                sendError(res, StatusCodes.Forbidden, ACCESS_DENIED)
                return
            }

            const user: string = decoded.user
            const roles: string[] = decoded.roles
            const authRoles: string[] = account.roles

            if (account.resigned?.resign || roles.length !== authRoles.length) {
                account.user = decoded.user
                account.token = ""
                await account.save()

                sendError(res, StatusCodes.Forbidden, ACCESS_DENIED)
                return
            }

            req.user = user
            req.roles = roles
            next()
        }
    )
})

export default jwtVerify