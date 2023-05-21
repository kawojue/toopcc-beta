import { Router } from 'express'
import jwtVerify from '../../middlewares/jwtVerify'
import {
    add, edit, remove
} from '../../controllers/patients'
import verifyRoles from '../../middlewares/verifyRoles'

const patients: Router = Router()

patients.use([jwtVerify, verifyRoles("admin")])

patients.post('/add', add)
patients.route('/:card_no')
    .put(edit)
    .delete(remove)

export default patients