"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedOrigins = void 0;
exports.allowedOrigins = [
    "http://localhost:1002",
    "http://localhost:3000",
    "https://toopcc.vercel.app",
];
const corsOption = {
    origin: (origin, callback) => {
        if (exports.allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS!"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
};
exports.default = corsOption;
