import { Router } from 'express'
import {
    add, edit, addDiagnosis, remove,
    deleteDianosis, editDiagnosis
} from '../../controllers/patients'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const patients: Router = Router()

patients.use([jwtVerify, verifyRoles("admin", "hr")])

patients.post('/add', add)
patients.route('/:card_no')
    .put(edit)
    .delete(remove)

patients.post('/diagnosis/:card_no', addDiagnosis)

patients.route('/diagnosis/:card_no/:idx')
    .put(editDiagnosis)
    .delete(deleteDianosis)

export default patients