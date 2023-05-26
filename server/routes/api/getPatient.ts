import { Router } from 'express'
import {
    allPatients, getAllDiagnosis
} from '../../controllers/gopd'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const getPatients: Router = Router()

getPatients.use([jwtVerify, verifyRoles("staff", "admin", "hr")])

getPatients.get('/all', allPatients)
getPatients.get('/diagnosis/all', getAllDiagnosis)

export default getPatients