import { Router, Request, Response } from 'express'

const root: Router = Router()

root.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TOOPCC"
    })
})

export default root