import { ILimiter } from '../type'
import { sendError } from '../utilities/sendResponse'
import { Request, Response, NextFunction } from 'express'
import rateLimit,
{ RateLimitRequestHandler, Options } from 'express-rate-limit'

export default function limiterFunc({
    max, timerArr, msg = "Too many requests sent."
}: ILimiter): RateLimitRequestHandler {
    const limiter: RateLimitRequestHandler = rateLimit({
        max, // max attempt
        windowMs: timerArr[Math.floor(Math.random() * timerArr.length)] * 1000, // throttle
        message: { msg },
        handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
            sendError(res, options.statusCode, options.message?.msg)
        },
        legacyHeaders: false,
        standardHeaders: true,
    })

    return limiter
}