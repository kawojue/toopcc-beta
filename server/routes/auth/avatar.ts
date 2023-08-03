import { Router } from 'express'
import {
    changeAvatar, deleteAvatar
} from '../../controllers/userAuth'
import jwtVerify from '../../middlewares/jwtVerify'
import multer, { StorageEngine, Multer } from 'multer'

const avatar: Router = Router()

avatar.use(jwtVerify)

const storage: StorageEngine = multer.memoryStorage()
const upload: Multer = multer({ storage })

avatar.route('/')
    .post(upload.single('avatar'), changeAvatar)
    .delete(deleteAvatar)

export default avatar