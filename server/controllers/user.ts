import {
    fetchUsers, fetchUserByUser
} from '../utilities/getModels'
import { Response } from 'express'
import { SUCCESS } from '../utilities/modal'
import expressAsyncHandler from 'express-async-handler'

const getUser = expressAsyncHandler(async (req: any, res: Response) => {
    const profile: any = await fetchUserByUser(req?.user, '-token -password -OTP')
    res.status(200).json({
        ...SUCCESS,
        profile
    })
})

export { getUser }