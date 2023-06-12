import { Router } from 'express'
import {
    changeAvatar, deleteAvatar
} from '../../controllers/userAuth'
import jwtVerify from '../../middlewares/jwtVerify'

const avatar: Router = Router()

avatar.use(jwtVerify)

avatar.route('/')
    .post(changeAvatar)
    .delete(deleteAvatar)

export default avatar