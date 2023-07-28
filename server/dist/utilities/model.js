"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPatients = exports.fetchUsers = exports.findByCardNo = exports.findByToken = exports.findByEmail = exports.findByUser = exports.Patient = exports.User = void 0;
const User_1 = __importDefault(require("../model/User"));
exports.User = User_1.default;
const Patient_1 = __importDefault(require("../model/Patient"));
exports.Patient = Patient_1.default;
const findByUser = async (user, omit) => {
    if (omit) {
        return await User_1.default.findOne({ user }).select(omit).exec();
    }
    else {
        return await User_1.default.findOne({ user }).exec();
    }
};
exports.findByUser = findByUser;
const findByEmail = async (email, omit) => {
    if (omit) {
        return await User_1.default.findOne({ email }).select(omit).exec();
    }
    else {
        return await User_1.default.findOne({ email }).exec();
    }
};
exports.findByEmail = findByEmail;
const findByToken = async (token, omit) => {
    if (omit) {
        return await User_1.default.findOne({ token }).select(omit).exec();
    }
    else {
        return await User_1.default.findOne({ token }).exec();
    }
};
exports.findByToken = findByToken;
const findByCardNo = async (card_no, omit) => {
    if (omit) {
        return await Patient_1.default.findOne({ card_no }).select(omit).exec();
    }
    else {
        return await Patient_1.default.findOne({ card_no }).exec();
    }
};
exports.findByCardNo = findByCardNo;
const fetchUsers = async (omit) => {
    if (omit) {
        return await User_1.default.find().select(omit).exec();
    }
    else {
        return await User_1.default.find().exec();
    }
};
exports.fetchUsers = fetchUsers;
const fetchPatients = async (omit) => {
    if (omit) {
        return await Patient_1.default.find().select(omit).exec();
    }
    else {
        return await Patient_1.default.find().exec();
    }
};
exports.fetchPatients = fetchPatients;
