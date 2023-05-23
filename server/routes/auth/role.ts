import { Router } from 'express'
import jwtVerify from '../../middlewares/jwtVerify'
import verifyRoles from '../../middlewares/verifyRoles'
import {
    resigned, changeRoles, removeRole
} from '../../controllers/userAuth'

const role: Router = Router()

role.use([jwtVerify, verifyRoles("hr")])

role.post('/resign', resigned)
role.post('/asign', changeRoles)
role.post('/remove', removeRole)

export default role