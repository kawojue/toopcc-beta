import { Router } from 'express'
import {
    allPatients, getAllDiagnosis, getDiagnosis,
    getPatient
} from '../../controllers/gopd'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const getPatients: Router = Router()

getPatients.use([jwtVerify, verifyRoles("staff", "admin", "hr")])

getPatients.get('/all', allPatients)
getPatients.get('/:card_no', allPatients)
getPatients.get('/diagnosis/:card_no', getDiagnosis)
getPatients.get('/diagnosis/all/:card_no', getAllDiagnosis)

export default getPatients