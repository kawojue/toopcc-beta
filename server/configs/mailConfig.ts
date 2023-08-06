import { Transporter, createTransport } from 'nodemailer'

const transporter: Transporter = createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    service: 'gmail',
    requireTLS: true,
    auth: {
        user: process.env.EMAIL!,
        pass: process.env.EMAIL_PSWD!
    }
})

export default transporter