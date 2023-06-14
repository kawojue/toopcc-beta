import { Router } from 'express'
import {
    getProfile, getUser, getUsers
} from '../../controllers/user'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const user: Router = Router()

user.use(jwtVerify)

user.get('/user/profile', getProfile)
user.get('/profile', verifyRoles("hr", "admin"), getUsers)
user.get('/profile/:user', verifyRoles("hr", "admin"), getUser)

export default user