import { Router } from 'express'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'
import {
    resigned, changeRoles, removeRole
} from '../../controllers/userAuth'

const role: Router = Router()

role.use([jwtVerify, verifyRoles("hr")])

role.post('/resign/:user', resigned)
role.post('/assign/:user', changeRoles)
role.post('/remove/:user', removeRole)

export default role