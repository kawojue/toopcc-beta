import { Router } from 'express'
import jwtVerify from '../../middlewares/jwtVerify'

const patients: Router = Router()

patients.use(jwtVerify)

export default patients