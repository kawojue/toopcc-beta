"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuth_1 = require("../../controllers/userAuth");
const jwtVerify_1 = __importDefault(require("../../middlewares/jwtVerify"));
const avatar = (0, express_1.Router)();
avatar.use(jwtVerify_1.default);
avatar.route('/')
    .post(userAuth_1.changeAvatar)
    .delete(userAuth_1.deleteAvatar);
exports.default = avatar;
