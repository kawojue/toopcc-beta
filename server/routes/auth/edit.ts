import { Router } from 'express'
import {
    editUsername, editPassword, editFullname
} from '../../controllers/userAuth'
import jwtVerify from '../../middlewares/jwtVerify'

const edit: Router = Router()

edit.use(jwtVerify)

edit.post('/username', editUsername)
edit.post('/fullname', editFullname)
edit.post('/password', editPassword)

export default edit