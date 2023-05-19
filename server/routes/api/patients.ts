import { Router } from 'express'
import { add } from '../../controllers/patients'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const patients: Router = Router()

patients.use([jwtVerify, verifyRoles("admin")])

patients.post('/add', add)

export default patients