import { Router } from 'express'
import {
    editUsername, editFullname, editPassword
} from '../../controllers/userAuth'
import jwtVerify from '../../middlewares/jwtVerify'

const edit: Router = Router()

edit.use(jwtVerify)

edit.post('/username', editUsername)
edit.post('/fullname', editFullname)
edit.post('/password', editPassword)

export default Router