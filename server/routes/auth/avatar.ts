import { Router } from 'express'
import {
    changeAvatar, deleteAvatar
} from '../../controllers/userAuth'
import upload from '../../middlewares/upload'
import jwtVerify from '../../middlewares/jwtVerify'

const avatar: Router = Router()

avatar.use(jwtVerify)

avatar.route('/')
    .post(upload.single('avatar'), changeAvatar)
    .delete(deleteAvatar)

export default avatar