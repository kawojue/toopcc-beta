import { Request, NextFunction } from "express"
import { allowedOrigins } from "../configs/corsOption"

const credentials = (req: Request, res: any, next: NextFunction) => {
    const origin: unknown = req.headers.origin
    if (allowedOrigins.includes(origin as string)) {
        res.header('Access-Control-Allow-Credentials', true)
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    }
    next()
}

export default credentials