import { ICloud } from "../type"
import AltPatient from '../models/AdvancePt'
import cloudinary from "../configs/cloudinary"

export default async function delDiag(card_no: string): Promise<boolean> {
    const patient: any = await AltPatient.findOne({ card_no }).exec()
    const bodies: any[] = patient.body
    if (bodies.length > 0) {
        bodies.forEach((body: any) => {
            const images: ICloud[] = body.images
            if (images.length > 0) {
                images.forEach(async (image: any) => {
                    const result = await cloudinary.uploader.destroy(image.public_id)
                    if (!result) return false
                })
            }
        })
    }
    return true
}