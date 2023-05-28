"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_1 = __importDefault(require("./otp"));
const edit_1 = __importDefault(require("./edit"));
const role_1 = __importDefault(require("./role"));
const avatar_1 = __importDefault(require("./avatar"));
const express_1 = require("express");
const userAuth_1 = require("../../controllers/userAuth");
const limiter_1 = __importDefault(require("../../middlewares/limiter"));
const auth = (0, express_1.Router)();
auth.use('/otp', otp_1.default);
auth.use('/edit', edit_1.default);
auth.use('/role', role_1.default);
auth.use('/avatar', avatar_1.default);
const loginLimiter = {
    max: 5,
    timerArr: [23, 32, 19, 52, 42],
    msg: "Too many attempts. Please, try again later."
};
auth.get('/logout', userAuth_1.logout);
auth.post('/signup', userAuth_1.createUser);
auth.post('/password/reset', userAuth_1.resetpswd);
auth.post('/login', (0, limiter_1.default)(loginLimiter), userAuth_1.login);
exports.default = auth;
