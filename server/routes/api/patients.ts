import { Router } from 'express'
import {
    add, edit, addDiagnosis,
    remove, deleteDianosis
} from '../../controllers/patients'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const patients: Router = Router()

patients.use([jwtVerify, verifyRoles("admin")])

patients.post('/add', add)
patients.route('/:card_no')
    .put(edit)
    .delete(remove)

patients.route('/diagnosis/:card_no')
    .post(addDiagnosis)
    .delete(deleteDianosis)

export default patients