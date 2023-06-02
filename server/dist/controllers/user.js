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
exports.getUser = void 0;
const getModels_1 = require("../utilities/getModels");
const modal_1 = require("../utilities/modal");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, getModels_1.fetchUserByUser)(req === null || req === void 0 ? void 0 : req.user, '-token -password -OTP');
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { profile }));
}));
exports.getUser = getUser;
