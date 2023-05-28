"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuth_1 = require("../../controllers/userAuth");
const limiter_1 = __importDefault(require("../../middlewares/limiter"));
const otp = (0, express_1.Router)();
otp.post('/verify', (0, limiter_1.default)({ max: 3, timerArr: [14, 9, 15] }), userAuth_1.verifyOTP);
otp.post('/request', (0, limiter_1.default)({ max: 1, timerArr: [15, 25, 40] }), userAuth_1.otpHandler);
exports.default = otp;
