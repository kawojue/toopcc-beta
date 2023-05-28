"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOption_1 = require("../configs/corsOption");
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (corsOption_1.allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
};
exports.default = credentials;
