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
exports.deleteRecommendation = exports.deletExtension = exports.editExtension = exports.addRecommendation = exports.editDiagnosis = exports.deleteDianosis = exports.remove = exports.addDiagnosis = exports.edit = exports.add = void 0;
const uuid_1 = require("uuid");
const Patient_1 = __importDefault(require("../models/Patient"));
const delDiag_1 = __importDefault(require("../utilities/delDiag"));
const addMedic_1 = __importDefault(require("../utilities/addMedic"));
const full_name_1 = __importDefault(require("../utilities/full_name"));
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const addExtension_1 = __importDefault(require("../utilities/addExtension"));
const getModels_1 = require("../utilities/getModels");
const modal_1 = require("../utilities/modal");
const asyncHandler = require('express-async-handler');
const phoneRegex = /^\d{11}$/;
// add patient data
const add = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { card_no, fullname, phone_no, address, age, date, sex } = req.body;
    card_no = card_no === null || card_no === void 0 ? void 0 : card_no.trim();
    address = address === null || address === void 0 ? void 0 : address.trim();
    fullname = fullname === null || fullname === void 0 ? void 0 : fullname.trim();
    if (!card_no || !fullname || !sex || !age)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    fullname = (0, full_name_1.default)(fullname);
    if (/^\d/.test(age)) {
        age = Number(age);
    }
    if (card_no.includes('/')) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Invalid card number." }));
    }
    if (phone_no === null || phone_no === void 0 ? void 0 : phone_no.trim()) {
        if (!phoneRegex.test(phone_no === null || phone_no === void 0 ? void 0 : phone_no.trim()))
            return res.status(400).json(modal_1.INVALID_PHONE_NO);
    }
    if (age > 120)
        return res.status(400).json(modal_1.INVALID_AGE);
    if (date)
        date = date;
    const patient = yield Patient_1.default.findOne({ card_no }).exec();
    if (patient)
        return res.status(409).json(modal_1.PATIENT_EXIST);
    yield Patient_1.default.create({
        sex, card_no, date,
        address, fullname,
        phone_no, age: age,
    });
    res.status(200).json(modal_1.SAVED);
}));
exports.add = add;
// edit patient data
const edit = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no } = req.params;
    let { fullname, sex, phone_no, address, age, death, cardNo } = req.body;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body -recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    if (cardNo || (cardNo === null || cardNo === void 0 ? void 0 : cardNo.trim())) {
        cardNo = cardNo.trim();
        const cardNoExists = yield Patient_1.default.findOne({ card_no: cardNo }).exec();
        if (cardNoExists)
            return res.status(409).json(modal_1.PATIENT_EXIST);
        patient.card_no = cardNo;
    }
    if (fullname) {
        fullname = (0, full_name_1.default)(fullname);
        if (!fullname) {
            return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Fullname is required." }));
        }
        patient.fullname = fullname;
    }
    if (sex) {
        if (sex !== "Male" && sex !== "Female") {
            return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Sex is required." }));
        }
        patient.sex = sex;
    }
    if (phone_no) {
        if (!(phone_no === null || phone_no === void 0 ? void 0 : phone_no.trim()) || !phoneRegex.test(phone_no === null || phone_no === void 0 ? void 0 : phone_no.trim())) {
            return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Invalid phone number" }));
        }
        patient.phone_no = phone_no.trim();
    }
    if (age) {
        age = Number(age);
        if (age > 120) {
            return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Age is not valid" }));
        }
        patient.age = age;
    }
    if (death === null || death === void 0 ? void 0 : death.dead) {
        if (Boolean(death === null || death === void 0 ? void 0 : death.dead) !== patient.death.dead) {
            if (!(death === null || death === void 0 ? void 0 : death.date)) {
                return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Date of death is required." }));
            }
            death = {
                dead: !Boolean(patient.dead),
                date: death.date
            };
            patient.death = death;
        }
    }
    if (address === null || address === void 0 ? void 0 : address.trim())
        patient.address = address;
    yield patient.save();
    res.status(200).json(modal_1.SAVED);
}));
exports.edit = edit;
// delete patient data
const remove = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { card_no } = req.params;
    if (!card_no || !(card_no === null || card_no === void 0 ? void 0 : card_no.trim()))
        return res.status(400).json(modal_1.CARD_NO_REQUIRED);
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no);
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const bodies = patient.body;
    const del = yield (0, delDiag_1.default)(bodies);
    if (!del)
        return res.status(400).json(modal_1.DELETION_FAILED);
    yield Patient_1.default.deleteOne({ card_no }).exec();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Patient data has been deleted." }));
}));
exports.remove = remove;
const addDiagnosis = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let imageRes;
    const imageArr = [];
    const { card_no } = req.params;
    let { date, images, texts, next_app } = req.body;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    if (images) {
        images = Array(images);
        if (images.length > 3)
            return res.status(400).json(modal_1.SMTH_WENT_WRONG);
        images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
            imageRes = yield cloudinary_1.default.uploader.upload(image, {
                folder: `TOOPCC/${patient.id}`,
                resource_type: 'image'
            });
            if (!imageRes)
                return res.status(400).json(modal_1.SMTH_WENT_WRONG);
            imageArr.push({
                secure_url: imageRes.secure_url,
                public_id: imageRes.public_id
            });
        }));
    }
    if (texts)
        texts = texts.trim();
    if (!date)
        date = `${new Date().toISOString()}`;
    patient.body = (imageArr.length > 0 || texts) ? [
        ...patient.body,
        {
            idx: (0, uuid_1.v4)(),
            diagnosis: {
                texts,
                images: imageArr,
            },
            date,
            next_app
        }
    ] : [...patient.body];
    yield patient.save();
    res.status(200).json(modal_1.SAVED);
}));
exports.addDiagnosis = addDiagnosis;
const editDiagnosis = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no, idx } = req.params;
    let { date, texts, next_app } = req.body;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const body = patient.body.find((body) => body.idx === idx);
    if (!body)
        return res.status(404).json(modal_1.DIAG_NOT_EXIST);
    if (texts)
        body.diagnosis.texts = texts.trim();
    if (date)
        body.date = date;
    if (next_app)
        body.next_app = next_app;
    yield patient.save();
    res.status(200).json(modal_1.SAVED);
}));
exports.editDiagnosis = editDiagnosis;
const addRecommendation = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { card_no } = req.params;
    const { opthal, extension, physio, eligOpthal, eligPhysio } = req.body;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const rec = patient.recommendation;
    const opthalmology = rec.opthalmology;
    const physiotherapy = rec.physiotherapy;
    if (opthal && (opthal === null || opthal === void 0 ? void 0 : opthal.date)) {
        const opthalMedic = opthalmology.medication;
        const newMedics = (0, addMedic_1.default)(opthal, opthalMedic);
        opthalmology.medication = newMedics;
    }
    if (physio && (physio === null || physio === void 0 ? void 0 : physio.date)) {
        const physioMedic = physiotherapy.medication;
        const newMedics = (0, addMedic_1.default)(physio, physioMedic);
        physiotherapy.medication = newMedics;
    }
    if (extension && ((_a = extension === null || extension === void 0 ? void 0 : extension.name) === null || _a === void 0 ? void 0 : _a.trim())) {
        const ext = rec.extensions;
        const newExtensions = (0, addExtension_1.default)(ext, extension);
        rec.extensions = newExtensions;
    }
    if (eligOpthal)
        opthalmology.eligible = Boolean(eligOpthal);
    if (eligPhysio)
        physiotherapy.eligible = Boolean(eligPhysio);
    yield patient.save();
    res.status(200).json(modal_1.SAVED);
}));
exports.addRecommendation = addRecommendation;
const deleteRecommendation = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.query;
    const { card_no, idx } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    if (type !== "physio" && type !== "opthal") {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Type is not defined." }));
    }
    const rec = patient.recommendation;
    const originalRec = type === "opthal" ? rec.opthalmology.medication : rec.physiotherapy.medication;
    const newRec = originalRec.filter((medic) => medic.idx !== idx);
    if (newRec.length === 0) {
        type === "opthal" ? rec.opthalmology.eligible = false : rec.physiotherapy.eligible = false;
    }
    type === "opthal" ? rec.opthalmology.medication = newRec : rec.physiotherapy.medication = newRec;
    yield patient.save();
    res.status(200).json(modal_1.SAVED);
}));
exports.deleteRecommendation = deleteRecommendation;
const deletExtension = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no, idx } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const extensions = patient.recommendation.extensions;
    const ext = extensions.find((element) => element.idx === idx);
    if (!ext)
        return res.status(404).json(modal_1.EXT_NOT_EXIST);
    patient.recommendation.extensions = extensions.filter((element) => element.idx !== idx);
    yield patient.save();
    return res.status(200).json(modal_1.SAVED);
}));
exports.deletExtension = deletExtension;
const editExtension = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no, idx } = req.params;
    const { extension } = req.body;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-body');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const extensions = patient.recommendation.extensions;
    const extt = extensions.find((element) => element.idx === idx);
    if (!extt)
        return res.status(404).json(modal_1.EXT_NOT_EXIST);
    patient.recommendation.extensions = extensions.map((ext) => ext.idx === idx ? Object.assign(Object.assign({}, ext), extension) : ext);
    yield patient.save();
    return res.status(200).json(modal_1.SAVED);
}));
exports.editExtension = editExtension;
const deleteDianosis = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { card_no, idx } = req.params;
    const patient = yield (0, getModels_1.fetchByCardNumber)(card_no, '-recommendation');
    if (!patient)
        return res.status(404).json(modal_1.PATIENT_NOT_EXIST);
    const bodies = patient.body;
    const body = bodies.find((body) => body.idx === idx);
    if (!body)
        return res.status(404).json(modal_1.DIAG_NOT_EXIST);
    const images = body.diagnosis.images;
    if (images.length > 0) {
        images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.default.uploader.destroy(image.public_id);
            if (!result)
                return res.status(400).json(modal_1.DELETION_FAILED);
        }));
    }
    patient.body = bodies.filter((body) => body.idx !== idx);
    yield patient.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Deleted successfully" }));
}));
exports.deleteDianosis = deleteDianosis;
