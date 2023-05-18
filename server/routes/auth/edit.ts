import { Router } from 'express'
import {
    editUsername, editFullname, editPassword
} from '../../controllers/userAuth'

const edit: Router = Router()

edit.post('/username', editUsername)
edit.post('/fullname', editFullname)
edit.post('/password', editPassword)

export default Router