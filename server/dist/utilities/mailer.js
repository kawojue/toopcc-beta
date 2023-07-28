"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailConfig_1 = __importDefault(require("../configs/mailConfig"));
async function mailer({ senderName, to, subject, text }) {
    try {
        await mailConfig_1.default.sendMail({
            from: `${senderName} <${process.env.EMAIL}>`,
            to,
            subject,
            text,
            headers: {
                'Content-Type': 'application/text',
            }
        });
        return true;
    }
    catch {
        return false;
    }
}
exports.default = mailer;
