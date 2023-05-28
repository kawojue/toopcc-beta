"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
function delDiag(bodies) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bodies.length > 0) {
            bodies.forEach((body) => {
                const images = body.diagnosis.images;
                if (images.length > 0) {
                    images.forEach((image) => __awaiter(this, void 0, void 0, function* () {
                        const result = yield cloudinary_1.default.uploader.destroy(image.public_id);
                        if (!result)
                            return false;
                    }));
                }
            });
        }
        return true;
    });
}
exports.default = delDiag;
