import dotenv from 'dotenv'
import nodemailer, { Transporter } from 'nodemailer'

dotenv.config()

const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    service: 'gmail',
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PSWD
    }
})

export default transporter