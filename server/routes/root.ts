import auth from './auth/auth'
import patients from './api/setPatient'
import getPatients from './api/getPatient'
import { Router, Request, Response } from 'express'

const root: Router = Router()

root.use('/auth', auth)
root.use('/api/patients', patients)
root.use('/api/getpts', getPatients)

root.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TOOPCC"
    })
})

export default root