import { Router } from 'express'
import {
    resigned, editRoles
} from '../../controllers/userAuth'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'

const role: Router = Router()

role.use([jwtVerify, verifyRoles("hr")])

role.put('/', editRoles)
role.post('/resign/:user', resigned)

export default role