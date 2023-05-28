import { Router } from 'express'
import {
    allPatients, getAllDiagnosis, getDiagnosis,
    getPatient, getAllPhysioPatients,
    getDeadPatients, getAllOpthalPatients,
} from '../../controllers/gopd'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const getPatients: Router = Router()

getPatients.use([jwtVerify, verifyRoles("staff", "admin", "hr")])

getPatients.get('/', allPatients)
getPatients.get('/dead', getDeadPatients)
getPatients.get('/patient/:card_no', getPatient)
getPatients.get('/diagnosis/:card_no', getAllDiagnosis)
getPatients.get('/diagnosis/:card_no/:idx', getDiagnosis)
getPatients.get('/recommendation/opthal', getAllOpthalPatients)
getPatients.get('/recommendation/physio', getAllPhysioPatients)

export default getPatients