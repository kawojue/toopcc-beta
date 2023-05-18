import { Router } from 'express'
import {
    verifyOTP, otpHandler
} from '../controllers/userAuth'
import limiter from '../middlewares/limiter'

const otp: Router = Router()

otp.post('/otp/verify', limiter({ max: 3, timerArr: [14, 9, 15] }), verifyOTP)
otp.post('/otp/request', limiter({ max: 1, timerArr: [15, 25, 40] }), otpHandler)

export default otp