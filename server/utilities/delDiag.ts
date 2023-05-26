import { ICloud, IBody } from "../type"
import cloudinary from "../configs/cloudinary"

export default async function delDiag(bodies: any[]): Promise<boolean> {
    if (bodies.length > 0) {
        bodies.forEach((body: IBody) => {
            const images: ICloud[] = body.diagnosis.images
            if (images.length > 0) {
                images.forEach(async (image: ICloud) => {
                    const result = await cloudinary.uploader.destroy(image.public_id)
                    if (!result) return false
                })
            }
        })
    }
    return true
}