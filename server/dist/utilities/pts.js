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
exports.fetchPatients = exports.fetchByCardNumber = void 0;
const Patient_1 = __importDefault(require("../models/Patient"));
const fetchByCardNumber = (card_no, omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    let patient;
    if (omit) {
        patient = yield Patient_1.default.findOne({ card_no }).exec();
    }
    else {
        patient = yield Patient_1.default.findOne({ card_no }).select(omit).exec();
    }
    return patient;
});
exports.fetchByCardNumber = fetchByCardNumber;
const fetchPatients = (omit = "") => __awaiter(void 0, void 0, void 0, function* () {
    let patients;
    if (omit) {
        patients = yield Patient_1.default.find().select(omit).exec();
    }
    else {
        patients = yield Patient_1.default.find().exec();
    }
    return patients;
});
exports.fetchPatients = fetchPatients;
