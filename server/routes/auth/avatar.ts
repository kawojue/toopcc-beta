import { Router } from 'express'
import {
    addAvatar, deleteAvatar
} from '../../controllers/userAuth'

const avatar: Router = Router()

avatar.route('/')
    .post(addAvatar)
    .get(deleteAvatar)

export default avatar