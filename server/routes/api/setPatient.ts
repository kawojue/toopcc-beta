import { Router } from 'express'
import {
    add, edit, addDiagnosis, remove,
    deleteDianosis, editDiagnosis,
    addRecommendation, editExtension,
    deletExtension, deleteRecommendation
} from '../../controllers/patients'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const patients: Router = Router()

// only admin and hr have access to do these.
patients.use([jwtVerify, verifyRoles("admin", "hr")])

// add, edit, and delete patient data routes
patients.post('/add', add)
patients.route('/patient/:card_no')
    .put(edit)
    .delete(remove)

// add, edit, and delete patient diagnosis routes
patients.post('/diagnosis/:card_no', addDiagnosis)
patients.route('/diagnosis/:card_no/:idx')
    .put(editDiagnosis)
    .delete(deleteDianosis)

// update and delete patient referral or recommendation routes
patients.put('/recommendation/:card_no', addRecommendation)
patients.delete('/recommendation/:card_no/:idx', deleteRecommendation)

// update and delete patient extension routes
patients.route('/recommendation/extension/:card_no/:idx')
    .put(editExtension)
    .delete(deletExtension)

export default patients