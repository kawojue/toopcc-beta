import dotenv from 'dotenv'
dotenv.config()

// import utilities
import cors from 'cors'
import logger from 'morgan'
import mongoose from 'mongoose'
import connectDB from './configs/dbConn'
import corsOption from './configs/corsOption'
import express, { Application } from 'express'
import credentials from './middlewares/credentials'

// import routes
import root from './routes/root'

const app: Application = express()
const PORT: unknown = process.env.PORT || 1002

connectDB(process.env.DB_URI as string)

// set middlewares
app.use(credentials)
app.use(express.json({ limit: '14mb' }))
app.use(logger('dev'))
app.use(cors(corsOption))
app.use(express.urlencoded({
    limit: '14mb', extended: true
}))

app.use('/', root)

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
})