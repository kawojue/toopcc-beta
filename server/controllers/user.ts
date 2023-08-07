import { IRequest } from '../type'
import { Response } from 'express'
import { getS3 } from '../utilities/s3'
import StatusCodes from '../utilities/StatusCodes'
import { sendSuccess } from '../utilities/sendResponse'
import { findByUser, fetchUsers } from '../utilities/model'
const expressAsyncHandler = require('express-async-handler')


const omit: string = '-totp -email_verified -totp_date -token -password'

const getProfile = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const getProfile = await findByUser(req.user, omit)

    const profile = {
        ...getProfile,
        avatarUrl: getProfile?.avatar_path ? await getS3(getProfile?.avatar_path) : ""
    }

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
    const { user: userParam }: any = req.params

    const getUser: any = await findByUser(userParam, omit)
    const user = {
        ...getUser,
        avatarUrl: getUser?.avatar_path ? await getS3(getUser?.avatar_path) : ""
    }

    sendSuccess(res, StatusCodes.OK, { user })
})

export { getProfile, getUser, getUsers }