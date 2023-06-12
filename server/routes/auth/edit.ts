import { Router } from 'express'
import {
    editUsername, resigned,
    editPassword, editFullname
} from '../../controllers/userAuth'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const edit: Router = Router()

edit.use(jwtVerify)

edit.post('/username', editUsername)
edit.post('/fullname', editFullname)
edit.post('/password', editPassword)

export default edit