"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = exports.sendError = void 0;
const sendError = (res, statusCode, msg) => {
    res.status(statusCode).json({ success: false, msg });
    return;
};
exports.sendError = sendError;
const sendSuccess = (res, statusCode, data) => {
    res.status(statusCode).json({ success: true, ...data });
    return;
};
exports.sendSuccess = sendSuccess;
