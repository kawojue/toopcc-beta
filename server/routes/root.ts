import auth from './auth/auth'
import patients from './api/patients'
import { Router, Request, Response } from 'express'

const root: Router = Router()

root.use('/auth', auth)
root.use('/api/patients', patients)

root.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TOOPCC"
    })
})

export default root