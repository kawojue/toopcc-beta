"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
async function delDiag(bodies) {
    if (bodies.length > 0) {
        bodies.forEach((body) => {
            const images = body.diagnosis.images;
            if (images.length > 0) {
                images.forEach(async (image) => {
                    const result = await cloudinary_1.default.uploader.destroy(image.public_id);
                    if (!result)
                        return false;
                });
            }
        });
    }
    return true;
}
exports.default = delDiag;
