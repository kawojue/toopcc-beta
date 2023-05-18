import { IMailer } from '../type'
import transporter from "../configs/mailConfig"

export default async function mailer({
    senderName, to, subject, text
}: IMailer): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: `${senderName} <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            headers: {
                'Content-Type': 'application/text',
            }
        })
        return true
    } catch {
        return false
    }
}