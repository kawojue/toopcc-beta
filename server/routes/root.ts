import user from './api/user'
import auth from './auth/auth'
import patients from './api/setPatient'
import getPatients from './api/getPatient'
import { Router, Request, Response } from 'express'

const root: Router = Router()

root.use('/auth', auth)
root.use('/api/user', user)
root.use('/patients', patients)
root.use('/api/patients', getPatients)

root.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TOOPCC"
    })
})

export default root