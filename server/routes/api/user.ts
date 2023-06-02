import { Router } from 'express'
import { getUser } from '../../controllers/user'
import jwtVerify from '../../middlewares/jwtVerify'

const user: Router = Router()

user.use(jwtVerify)

user.get('/profile', getUser)

export default user