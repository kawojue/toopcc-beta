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
exports.fetchUserByEmail = exports.fetchPatients = exports.fetchByCardNumber = exports.fetchUsers = exports.fetchUserByUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Patient_1 = __importDefault(require("../models/Patient"));
const fetchByCardNumber = (card_no, omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    if (omit === "") {
        return yield Patient_1.default.findOne({ card_no }).exec();
    }
    return yield Patient_1.default.findOne({ card_no }).select(omit).exec();
});
exports.fetchByCardNumber = fetchByCardNumber;
const fetchUserByUser = (user, omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    if (omit === "") {
        return yield User_1.default.findOne({ user }).exec();
    }
    return yield User_1.default.findOne({ user }).select(omit).exec();
});
exports.fetchUserByUser = fetchUserByUser;
const fetchUserByEmail = (email, omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    if (omit === "") {
        return yield User_1.default.findOne({ 'mail.email': email }).exec();
    }
    return yield User_1.default.findOne({ 'mail.email': email }).select(omit).exec();
});
exports.fetchUserByEmail = fetchUserByEmail;
const fetchPatients = (omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    if (omit === "") {
        return yield Patient_1.default.find().exec();
    }
    return yield Patient_1.default.find().select(omit).exec();
});
exports.fetchPatients = fetchPatients;
const fetchUsers = (omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    if (omit === "") {
        return yield User_1.default.find().exec();
    }
    return yield User_1.default.find().select(omit).exec();
});
exports.fetchUsers = fetchUsers;
