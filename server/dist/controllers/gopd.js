"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPhysioPatients = exports.getAllOpthalPatients = exports.getDeadPatients = exports.getOpthalMedication = exports.getAllExtensions = exports.getPatient = exports.getDiagnosis = exports.getPhysioMedication = exports.getExtension = exports.getAllDiagnosis = exports.allPatients = void 0;
const modal_1 = require("../utilities/modal");
const model_1 = require("../utilities/model");
const sorting_1 = require("../utilities/sorting");
const StatusCodes_1 = __importDefault(require("../utilities/StatusCodes"));
const asyncHandler = require('express-async-handler');
const allPatients = asyncHandler(async (req, res) => {
    const patients = await (0, model_1.fetchPatients)('-body -recommendation');
    res.status(StatusCodes_1.default.OK).json({ patients: (0, sorting_1.sortByCardNumbers)(patients) });
});
exports.allPatients = allPatients;
const getPatient = asyncHandler(async (req, res) => {
    const { card_no } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no, '-body -recommendation');
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    res.status(StatusCodes_1.default.OK).json({ patient });
});
exports.getPatient = getPatient;
const getAllDiagnosis = asyncHandler(async (req, res) => {
    const { card_no } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no, '-recommendation');
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: patient.body.length,
        diagnosis: (0, sorting_1.sortByDates)(patient.body)
    });
});
exports.getAllDiagnosis = getAllDiagnosis;
const getDiagnosis = asyncHandler(async (req, res) => {
    const { card_no, idx } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no, '-recommendation');
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const bodies = patient.body;
    const diagnosis = bodies.find((body) => body.idx === idx);
    if (!diagnosis) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.DIAG_NOT_EXIST);
    }
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        diagnosis: (0, sorting_1.sortByDates)(diagnosis)
    });
});
exports.getDiagnosis = getDiagnosis;
const getAllOpthalPatients = asyncHandler(async (req, res) => {
    const patients = await (0, model_1.fetchPatients)('-body');
    const opthals = patients.filter((opthal) => opthal.recommendation?.opthalmology?.eligible === true);
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: opthals.length,
        patients: (0, sorting_1.sortByCardNumbers)(opthals)
    });
});
exports.getAllOpthalPatients = getAllOpthalPatients;
const getAllPhysioPatients = asyncHandler(async (req, res) => {
    const patients = await (0, model_1.fetchPatients)('-body');
    const physios = patients.filter((physio) => physio.recommendation?.physiotherapy?.eligible === true);
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: physios.length,
        patients: (0, sorting_1.sortByCardNumbers)(physios)
    });
});
exports.getAllPhysioPatients = getAllPhysioPatients;
const getAllExtensions = asyncHandler(async (req, res) => {
    const patients = await (0, model_1.fetchPatients)('-body');
    const all = patients.map((ext) => {
        let obj;
        const extensions = ext.recommendation?.extensions;
        if (extensions.length > 0) {
            obj = {
                fullname: ext.fullname,
                extensions: extensions,
                date: extensions[extensions?.length - 1].date,
                card_no: ext.card_no,
                phone_no: ext.phone_no,
            };
        }
        return obj;
    });
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: all.length,
        extensions: (0, sorting_1.sortByDates)(all)
    });
});
exports.getAllExtensions = getAllExtensions;
const getDeadPatients = asyncHandler(async (req, res) => {
    const patients = await (0, model_1.fetchPatients)('-body -recommendation');
    const deads = patients.filter((dead) => {
        let obj;
        if (dead.death?.dead === true) {
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
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: deads.length,
        deaths: (0, sorting_1.sortByDates)(deads)
    });
});
exports.getDeadPatients = getDeadPatients;
const getExtension = asyncHandler(async (req, res) => {
    const { card_no } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no, '-body');
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const extensions = patient.recommendation?.extensions;
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        patient: {
            fullname: patient.fullname,
            card_no: patient.card_no,
            phone_no: patient.phone_no,
            address: patient.address
        },
        length: extensions?.length,
        extensions: (0, sorting_1.sortByDates)(extensions)
    });
});
exports.getExtension = getExtension;
const getPhysioMedication = asyncHandler(async (req, res) => {
    const { card_no } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no, '-body');
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const medications = patient.recommendation?.physiotherapy?.medication;
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: medications?.length,
        medications: (0, sorting_1.sortByDates)(medications)
    });
});
exports.getPhysioMedication = getPhysioMedication;
const getOpthalMedication = asyncHandler(async (req, res) => {
    const { card_no } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no, '-body');
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const medications = patient.recommendation?.opthalmology?.medication;
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        length: medications?.length,
        medications: (0, sorting_1.sortByDates)(medications)
    });
});
exports.getOpthalMedication = getOpthalMedication;
