"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../controllers/user");
const jwtVerify_1 = __importDefault(require("../../middlewares/jwtVerify"));
const verifyRoles_1 = __importDefault(require("../../middlewares/verifyRoles"));
const user = (0, express_1.Router)();
user.use(jwtVerify_1.default);
user.get('/profile', user_1.getProfile);
user.get('/profile/:user', (0, verifyRoles_1.default)("hr", "admin"), user_1.getUser);
user.get('/profile/users', (0, verifyRoles_1.default)("hr", "admin"), user_1.getUsers);
exports.default = user;
