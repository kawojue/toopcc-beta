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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const modal_1 = require("../utilities/modal");
const asyncHandler = require('express-async-handler');
const jwtVerify = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!authHeader || !(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer')))
        return res.status(401).json(modal_1.ACCESS_DENIED);
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json(modal_1.ACCESS_DENIED);
        const account = yield User_1.default.findOne({ token }).exec();
        if (!account)
            return res.status(403).json(modal_1.ACCESS_DENIED);
        const user = decoded.user;
        const roles = decoded.roles;
        const authRoles = account.roles;
        if (account.resigned.resign || roles.length !== authRoles.length) {
            account.token = "";
            yield account.save();
            return res.status(403).json(modal_1.ACCESS_DENIED);
        }
        req.user = user;
        req.roles = roles;
        next();
    }));
}));
exports.default = jwtVerify;
