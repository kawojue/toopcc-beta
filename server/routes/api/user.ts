import { Router } from 'express'
import {
    getProfile, getUser, getUsers
} from '../../controllers/user'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const user: Router = Router()

user.use(jwtVerify)

user.get('/profile', getProfile)
user.get('/profile/:user', verifyRoles("hr"), getUser)
user.get('/profile/users', verifyRoles("admin", "hr"), getUsers)

export default user