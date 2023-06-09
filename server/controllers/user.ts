import {
    fetchUsers, fetchUserByUser
} from '../utilities/getModels'
import { Response } from 'express'
import { SUCCESS } from '../utilities/modal'
import expressAsyncHandler from 'express-async-handler'

const getProfile = expressAsyncHandler(async (req: any, res: Response) => {
    const profile: any = await fetchUserByUser(req?.user, '-token -password -OTP')
    
    res.status(200).json({ ...SUCCESS, profile })
})

const getUsers = expressAsyncHandler(async (req: any, res: Response) => {
    const users: any = await fetchUsers()
    const names: string[] = users.map((user: any) => {
        return { username: user.user, fullname: user.fullname }
    })

    res.status(200).json({ ...SUCCESS, names })
})

const getUser = expressAsyncHandler(async (req: any, res: Response) => {
    const { user: userParam }: any = req.params
    const user: any = await fetchUserByUser(userParam, '-token -password -OTP')
    
    res.status(200).json({ ...SUCCESS, user })
})

export { getProfile, getUser, getUsers }