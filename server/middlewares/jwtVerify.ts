import jwt from 'jsonwebtoken'
import prisma from '../prisma'
import { IRequest } from '../type'
import { Response, NextFunction } from 'express'
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

            const account = await prisma.user.findUnique({
                where: {
                    user: decoded.user
                }
            })

            if (!account) {
                return res.status(StatusCodes.Forbidden).json(ACCESS_DENIED)
            }

            const user: string = decoded.user
            const roles: string[] = decoded.roles
            const authRoles: string[] = account.roles

            if (account.resigned?.resign || roles.length !== authRoles.length) {
                await prisma.user.update({
                    where: {
                        user: decoded.user
                    },
                    data: {
                        token: ""
                    }
                })
                return res.status(StatusCodes.Forbidden).json(ACCESS_DENIED)
            }

            req.user = user
            req.roles = roles
            next()
        }
    )
})

export default jwtVerify