import { IRequest } from '../type'
import { Response } from 'express'
import StatusCodes from '../utilities/StatusCodes'
import { sendSuccess } from '../utilities/sendResponse'
import { findByUser, fetchUsers } from '../utilities/model'
const expressAsyncHandler = require('express-async-handler')

const getProfile = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const profile = await findByUser(req.user, '-totp -email_verified -totp_date -token -password')

    sendSuccess(res, StatusCodes.OK, { profile })
})

const getUsers = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const users = await fetchUsers('-totp -email_verified -totp_date -token -password')

    const names = users.map((user) => {
        return { username: user.user, fullname: user.fullname }
    })

    sendSuccess(res, StatusCodes.OK, { names })
})

const getUser = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const { user: userParam }: any = req.params

    const user: any = await findByUser(userParam, '-totp -email_verified -totp_date -token -password')

    sendSuccess(res, StatusCodes.OK, { user })
})

export { getProfile, getUser, getUsers }