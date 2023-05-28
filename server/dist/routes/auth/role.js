"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtVerify_1 = __importDefault(require("../../middlewares/jwtVerify"));
const verifyRoles_1 = __importDefault(require("../../middlewares/verifyRoles"));
const userAuth_1 = require("../../controllers/userAuth");
const role = (0, express_1.Router)();
role.use([jwtVerify_1.default, (0, verifyRoles_1.default)("hr")]);
role.post('/resign/:user', userAuth_1.resigned);
role.post('/assign/:user', userAuth_1.changeRoles);
role.post('/remove/:user', userAuth_1.removeRole);
exports.default = role;
