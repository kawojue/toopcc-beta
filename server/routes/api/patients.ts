import { Router } from 'express'
import jwtVerify from '../../middlewares/jwtVerify'
import { add, edit } from '../../controllers/patients'
import verifyRoles from '../../middlewares/verifyRoles'

const patients: Router = Router()

patients.use([jwtVerify, verifyRoles("admin")])

patients.post('/add', add)
patients.post('/edit', edit)

export default patients