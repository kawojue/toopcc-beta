import { Router } from 'express'
import {
    getProfile, getUser, getUsers
} from '../../controllers/user'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const user: Router = Router()

user.use(jwtVerify)

user.get('/profile', getProfile)
user.get('/profile/:user', verifyRoles("hr", "admin"), getUser)
user.get('/profile/users', verifyRoles("hr", "admin"), getUsers)

export default user