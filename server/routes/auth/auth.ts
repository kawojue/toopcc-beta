import otp from './otp'
import edit from './edit'
import role from './role'
import avatar from './avatar'
import { Router } from 'express'
import {
    login, logout, createUser, resetpswd,
} from '../../controllers/userAuth'
import { ILimiter } from '../../type'
import upload from '../../middlewares/upload'
import limiter from '../../middlewares/limiter'

const auth: Router = Router()

auth.use('/otp', otp)
auth.use('/edit', edit)
auth.use('/role', role)
auth.use('/avatar', avatar)

const loginLimiter: ILimiter = {
    max: 5,
    timerArr: [23, 32, 19, 52, 42],
    msg: "Too many attempts. Please, try again later."
}

auth.get('/logout', logout)
auth.post('/password/reset', resetpswd)
auth.post('/login', limiter(loginLimiter), login)
auth.post('/signup', upload.single('avatar'), createUser)


export default auth