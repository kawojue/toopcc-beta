"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./api/user"));
const auth_1 = __importDefault(require("./auth/auth"));
const setPatient_1 = __importDefault(require("./api/setPatient"));
const getPatient_1 = __importDefault(require("./api/getPatient"));
const express_1 = require("express");
const root = (0, express_1.Router)();
root.use('/auth', auth_1.default);
root.use('/api/users', user_1.default);
root.use('/patients', setPatient_1.default);
root.use('/api/patients', getPatient_1.default);
root.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to TOOPCC"
    });
});
exports.default = root;
