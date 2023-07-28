import { IRequest } from '../type'
import { Response } from 'express'
import { SUCCESS } from '../utilities/modal'
import { findByUser, fetchUsers } from '../utilities/model'
const expressAsyncHandler = require('express-async-handler')

const getProfile = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const profile = await fetchUsers('-totp -email_verified -totp_date -token -password')

    res.status(200).json({ ...SUCCESS, profile })
})

const getUsers = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const users = await fetchUsers('-totp -email_verified -totp_date -token -password')

    const names = users.map((user) => {
        return { username: user.user, fullname: user.fullname }
    })

    res.status(200).json({ ...SUCCESS, names })
})

const getUser = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const { user: userParam }: any = req.params

    const user: any = await findByUser(userParam, '-totp -email_verified -totp_date -token -password')

    res.status(200).json({ ...SUCCESS, user })
})

export { getProfile, getUser, getUsers }