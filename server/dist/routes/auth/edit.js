"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuth_1 = require("../../controllers/userAuth");
const jwtVerify_1 = __importDefault(require("../../middlewares/jwtVerify"));
const edit = (0, express_1.Router)();
edit.use(jwtVerify_1.default);
edit.post('/username', userAuth_1.editUsername);
edit.post('/fullname', userAuth_1.editFullname);
edit.post('/password', userAuth_1.editPassword);
exports.default = edit;
