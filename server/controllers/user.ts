import { IRequest } from '../type'
import { Response } from 'express'
import StatusCodes from '../utilities/StatusCodes'
import { ACCOUNT_NOT_FOUND } from '../utilities/modal'
import { findByUser, fetchUsers } from '../utilities/model'
const expressAsyncHandler = require('express-async-handler')
import { sendError, sendSuccess } from '../utilities/sendResponse'


const omit: string = '-totp -email_verified -totp_date -token -password'

const getProfile = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const profile = await findByUser(req.user, omit)

    sendSuccess(res, StatusCodes.OK, { profile })
})

const getUsers = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const users = await fetchUsers(omit)

    const names = users.map((user) => {
        return { username: user.user, fullname: user.fullname }
    })

    sendSuccess(res, StatusCodes.OK, { names })
})

const getUser = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const { user: userParam } = req.params

    const user = await findByUser(userParam, omit)
    if (!user) {
        sendError(res, StatusCodes.NotFound, ACCOUNT_NOT_FOUND)
    }

    sendSuccess(res, StatusCodes.OK, { user })
})

export { getProfile, getUser, getUsers }