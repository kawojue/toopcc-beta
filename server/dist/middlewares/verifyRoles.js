"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkRoles_1 = __importDefault(require("../utilities/checkRoles"));
const modal_1 = require("../utilities/modal");
const verifyRoles = (...roles) => {
    return (req, res, next) => {
        if (!(req === null || req === void 0 ? void 0 : req.roles))
            return res.status(401).json(modal_1.ACCESS_DENIED);
        const authRoles = req.roles;
        const allowedRoles = [...roles];
        if (!(0, checkRoles_1.default)(authRoles, allowedRoles))
            return res.status(401).json(modal_1.ACCESS_DENIED);
        next();
    };
};
exports.default = verifyRoles;
