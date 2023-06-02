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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPhysioPatients = exports.getAllOpthalPatients = exports.getDeadPatients = exports.getOpthalMedication = exports.getAllExtensions = exports.getPatient = exports.getDiagnosis = exports.getPhysioMedication = exports.getExtension = exports.getAllDiagnosis = exports.allPatients = void 0;
const modal_1 = require("../utilities/modal");
const sorting_1 = require("../utilities/sorting");
const getModels_1 = require("../utilities/getModels");
const asyncHandler = require('express-async-handler');
const allPatients = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patients = yield (0, getModels_1.fetchPatients)('-body -recommendation');
    res.status(200).json({ patients: (0, sorting_1.sortByCardNumbers)(patients) });
}));
exports.allPatients = allPatients;
const getPatient = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body -recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    res.status(200).json({ patient: patient });
}));
exports.getPatient = getPatient;
const getAllDiagnosis = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: patient.body.length, diagnosis: (0, sorting_1.sortByDates)(patient.body) }));
}));
exports.getAllDiagnosis = getAllDiagnosis;
const getDiagnosis = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no, idx } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const bodies = patient.body;
    const diagnosis = bodies.find((body) => body.idx === idx);
    if (!diagnosis)
        return res.status(404).json(modal_1.DIAG_NOT_EXIST);
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { diagnosis }));
}));
exports.getDiagnosis = getDiagnosis;
const getAllOpthalPatients = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patients = yield (0, getModels_1.fetchPatients)('-body');
    const opthals = patients.filter((opthal) => opthal.recommendation.opthalmology.eligible === true);
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: opthals.length, patients: (0, sorting_1.sortByCardNumbers)(opthals) }));
}));
exports.getAllOpthalPatients = getAllOpthalPatients;
const getAllPhysioPatients = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patients = yield (0, getModels_1.fetchPatients)('-body');
    const physios = patients.filter((physio) => physio.recommendation.physiotherapy.eligible === true);
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: physios.length, patients: (0, sorting_1.sortByCardNumbers)(physios) }));
}));
exports.getAllPhysioPatients = getAllPhysioPatients;
const getDeadPatients = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patients = yield (0, getModels_1.fetchPatients)('-body');
    const deads = patients.filter((dead) => {
        let obj;
        if (dead.death.dead === true) {
            const { fullname, age, card_no, address, phone_no } = dead;
            obj = {
                fullname, age, card_no,
                phone_no, address,
                date_vist: dead.date,
                date: dead.death.date
            };
        }
        return obj;
    });
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: deads.length, deaths: (0, sorting_1.sortByDates)(deads) }));
}));
exports.getDeadPatients = getDeadPatients;
const getAllExtensions = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patients = yield (0, getModels_1.fetchPatients)('-body');
    const all = patients.map((ext) => {
        let obj;
        const extensions = ext.recommendation.extensions;
        if (extensions.length > 0) {
            obj = {
                fullname: ext.fullname,
                extensions: extensions,
                date: extensions[extensions.length - 1].date,
                card_no: ext.card_no,
                phone_no: ext.phone_no,
            };
        }
        return obj;
    });
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: all.length, extensions: (0, sorting_1.sortByDates)(all) }));
}));
exports.getAllExtensions = getAllExtensions;
const getExtension = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const extensions = patient.recommendation.extensions;
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { patient: {
            fullname: patient.fullname,
            card_no: patient.card_no,
            phone_no: patient.phone_no,
            address: patient.address
        }, length: extensions.length, extensions: (0, sorting_1.sortByDates)(extensions) }));
}));
exports.getExtension = getExtension;
const getPhysioMedication = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const medications = patient.recommendation.physiotherapy.medication;
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: medications.length, medications: (0, sorting_1.sortByDates)(medications) }));
}));
exports.getPhysioMedication = getPhysioMedication;
const getOpthalMedication = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const medications = patient.recommendation.opthalmology.medication;
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { length: medications.length, medications: (0, sorting_1.sortByDates)(medications) }));
}));
exports.getOpthalMedication = getOpthalMedication;
