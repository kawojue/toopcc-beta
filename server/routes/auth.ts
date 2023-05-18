import otp from './otp'
import { Router } from 'express'
import {
    login, logout, createUser,
    editUsername, resetpswd,
} from '../controllers/userAuth'
import { ILimiter } from '../type'
import limiter from '../middlewares/limiter'
import jwtVerify from '../middlewares/jwtVerify'

const auth: Router = Router()

auth.use('/', otp)

const loginLimiter: ILimiter = {
    max: 5,
    timerArr: [23, 32, 19, 52, 42],
    msg: "Too many attempts. Please, try again later."
}

auth.get('/logout', logout)
auth.post('/signup', createUser)
auth.post('/password/reset', resetpswd)
auth.post('/login', limiter(loginLimiter), login)
auth.post('/edit/username', jwtVerify, editUsername)


export default auth