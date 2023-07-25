import { Images } from "../type"
import cloudinary from "../configs/cloudinary"

export default async function delDiag(bodies: any[]): Promise<boolean> {
    if (bodies.length > 0) {
        bodies.forEach((body) => {
            const images: Images[] = body.diagnosis.images
            if (images.length > 0) {
                images.forEach(async (image: Images) => {
                    const result = await cloudinary.uploader.destroy(image.public_id as string)
                    if (!result) return false
                })
            }
        })
    }
    return true
}