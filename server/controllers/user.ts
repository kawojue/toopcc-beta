import prisma from '../prisma'
import { IRequest } from '../type'
import { Response } from 'express'
import { SUCCESS } from '../utilities/modal'
const expressAsyncHandler = require('express-async-handler')

const getProfile = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const profile = await prisma.user.findUnique({
        where: {
            user: req.user
        },
        select: {
            id: true,
            user: true,
            mail: true,
            avatar: true,
            fullname: true,
            resigned: true,
            createdAt: true,
            lastLogin: true
        }
    })

    res.status(200).json({ ...SUCCESS, profile })
})

const getUsers = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const users = await prisma.user.findMany()

    const names = users.map((user) => {
        return { username: user.user, fullname: user.fullname }
    })

    res.status(200).json({ ...SUCCESS, names })
})

const getUser = expressAsyncHandler(async (req: IRequest, res: Response) => {
    const { user: userParam }: any = req.params

    const user: any = await prisma.user.findUnique({
        where: {
            user: userParam
        },
        select: {
            id: true,
            user: true,
            mail: true,
            avatar: true,
            fullname: true,
            resigned: true,
            createdAt: true,
            lastLogin: true
        }
    })

    res.status(200).json({ ...SUCCESS, user })
})

export { getProfile, getUser, getUsers }