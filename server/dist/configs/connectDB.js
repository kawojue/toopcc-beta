"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (DATABASE_URL) => {
    try {
        await mongoose_1.default.connect(DATABASE_URL, {
            dbName: "TOOPCC"
        });
    }
    catch {
        throw new Error("Connection Failed!");
    }
};
exports.default = connectDB;
