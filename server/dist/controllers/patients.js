"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecommendation = exports.deletExtension = exports.editExtension = exports.addRecommendation = exports.editDiagnosis = exports.deleteDianosis = exports.remove = exports.addDiagnosis = exports.edit = exports.add = void 0;
const uuid_1 = require("uuid");
const delDiag_1 = __importDefault(require("../utilities/delDiag"));
const full_name_1 = __importDefault(require("../utilities/full_name"));
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const StatusCodes_1 = __importDefault(require("../utilities/StatusCodes"));
const model_1 = require("../utilities/model");
const expressAsyncHandler = require('express-async-handler');
const recommendation_1 = require("../utilities/recommendation");
const modal_1 = require("../utilities/modal");
const phoneRegex = /^\d{11}$/;
// add patient data
const add = expressAsyncHandler(async (req, res) => {
    let { card_no, fullname, phone_no, address, age, date, sex } = req.body;
    address = address?.trim();
    fullname = (0, full_name_1.default)(fullname);
    card_no = card_no?.trim()?.toUpperCase();
    if (!card_no || !fullname || !sex || !age) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    if (/^\d/.test(age)) {
        age = Number(age);
    }
    if (!/^[a-zA-Z0-9]+$/.test(card_no)) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "Invalid card number."
        });
    }
    if (phone_no?.trim()) {
        if (!phoneRegex.test(phone_no?.trim())) {
            return res.status(StatusCodes_1.default.BadRequest).json(modal_1.INVALID_PHONE_NO);
        }
    }
    if (age > 120) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.INVALID_AGE);
    }
    if (date) {
        date = date;
    }
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (patient) {
        return res.status(StatusCodes_1.default.Conflict).json(modal_1.PATIENT_EXIST);
    }
    await model_1.Patient.create({
        sex, card_no, date,
        address, fullname,
        phone_no, age: age,
    });
    res.status(StatusCodes_1.default.Created).json(modal_1.SAVED);
});
exports.add = add;
// edit patient data
const edit = expressAsyncHandler(async (req, res) => {
    const { card_no } = req.params;
    let { fullname, sex, phone_no, address, age, death, cardNo, date } = req.body;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    if (cardNo || cardNo?.trim()) {
        cardNo = cardNo.trim().toUpperCase();
        const cardNoExists = await (0, model_1.findByCardNo)(cardNo);
        if (cardNoExists) {
            return res.status(StatusCodes_1.default.Conflict).json(modal_1.PATIENT_EXIST);
        }
        patient.card_no = cardNo;
    }
    if (fullname) {
        fullname = (0, full_name_1.default)(fullname);
        if (!fullname) {
            return res.status(StatusCodes_1.default.BadRequest).json({
                ...modal_1.ERROR,
                msg: "Fullname is required."
            });
        }
        patient.fullname = fullname;
    }
    if (sex) {
        if (sex !== "Male" && sex !== "Female") {
            return res.status(StatusCodes_1.default.BadRequest).json({
                ...modal_1.ERROR,
                msg: "Sex is required."
            });
        }
        patient.sex = sex;
    }
    if (phone_no) {
        if (!phone_no?.trim() || !phoneRegex.test(phone_no?.trim())) {
            return res.status(StatusCodes_1.default.BadRequest).json({
                ...modal_1.ERROR,
                msg: "Invalid phone number."
            });
        }
        patient.phone_no = phone_no.trim();
    }
    if (age) {
        if (age > 120) {
            return res.status(StatusCodes_1.default.BadRequest).json({
                ...modal_1.ERROR,
                msg: "Invalid Age specified."
            });
        }
        patient.age = age;
    }
    if (death) {
        if (death.dead === true && !death.date) {
            death = { dead: true, date: '' };
        }
        if (death.dead === false) {
            death = { dead: false, date: '' };
        }
        patient.death = death;
    }
    if (address?.trim()) {
        patient.address = address;
    }
    if (date) {
        patient.date = date;
    }
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.edit = edit;
// delete patient data
const remove = expressAsyncHandler(async (req, res) => {
    let { card_no } = req.params;
    if (!card_no || !card_no?.trim()) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.CARD_NO_REQUIRED);
    }
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const bodies = await patient.body;
    const del = await (0, delDiag_1.default)(bodies);
    if (!del) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.DELETION_FAILED);
    }
    await patient.deleteOne();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "Patient data has been deleted."
    });
});
exports.remove = remove;
const addDiagnosis = expressAsyncHandler(async (req, res) => {
    let imageRes;
    const imageArr = [];
    const { card_no } = req.params;
    let { date, images, texts, next_app } = req.body;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    if (!date) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "Current date is required."
        });
    }
    if (texts || texts?.trim()) {
        texts = texts.trim();
    }
    if (images.length > 0 && images.length <= 3) {
        images.forEach(async (image) => {
            imageRes = await cloudinary_1.default.uploader.upload(image, {
                folder: `TOOPCC/${patient.id}`,
                resource_type: 'image'
            });
            if (!imageRes) {
                return res.status(StatusCodes_1.default.BadRequest).json(modal_1.SMTH_WENT_WRONG);
            }
            imageArr.push({
                secure_url: imageRes.secure_url,
                public_id: imageRes.public_id
            });
        });
    }
    const patientBody = patient.body;
    patient.body = (imageArr.length > 0 || texts) ? [
        ...patientBody,
        {
            date,
            next_app,
            idx: (0, uuid_1.v4)(),
            diagnosis: {
                texts,
                images: imageArr,
            },
        }
    ] : [...patientBody];
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.addDiagnosis = addDiagnosis;
const editDiagnosis = expressAsyncHandler(async (req, res) => {
    const { card_no, idx } = req.params;
    let { date, texts, next_app } = req.body;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const body = patient.body.find((body) => body.idx === idx);
    if (!body) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.DIAG_NOT_EXIST);
    }
    if (texts) {
        body.diagnosis.texts = texts.trim();
    }
    if (date) {
        body.date = date;
    }
    if (next_app) {
        body.next_app = next_app;
    }
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.editDiagnosis = editDiagnosis;
const addRecommendation = expressAsyncHandler(async (req, res) => {
    const { card_no } = req.params;
    const { opthal, extension, physio, eligOpthal, eligPhysio } = req.body;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    let extensions = patient.recommendation?.extensions;
    const opthalmology = patient.recommendation?.opthalmology;
    const physiotherapy = patient.recommendation?.physiotherapy;
    if (opthal && opthal?.date) {
        const opthalMedic = opthalmology?.medication;
        const newMedics = (0, recommendation_1.addMedic)(opthal, opthalMedic);
        opthalmology.medication = newMedics;
    }
    if (physio && physio?.date) {
        const physioMedic = physiotherapy?.medication;
        const newMedics = (0, recommendation_1.addMedic)(physio, physioMedic);
        physiotherapy.medication = newMedics;
    }
    if (extension && extension?.name?.trim()) {
        const newExtensions = (0, recommendation_1.addExtension)(extensions, extension);
        extensions = newExtensions;
    }
    if (eligOpthal) {
        opthalmology.eligible = Boolean(eligOpthal);
    }
    if (eligPhysio) {
        physiotherapy.eligible = Boolean(eligPhysio);
    }
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.addRecommendation = addRecommendation;
const deleteRecommendation = expressAsyncHandler(async (req, res) => {
    const { type } = req.query;
    const { card_no, idx } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const rec = patient.recommendation;
    const originalRec = type === 'opthal' ?
        rec.opthalmology.medication : type === 'physio' ?
        rec.physiotherapy.medication : [];
    const newRec = originalRec?.filter((medic) => medic.idx !== idx);
    if (newRec?.length === 0) {
        type === 'opthal' ? rec.opthalmology.eligible = false :
            type === 'physio' ? rec.physiotherapy.eligible = false : null;
    }
    type === 'opthal' ? rec.opthalmology.medication = newRec :
        type === 'physio' ? rec.physiotherapy.medication = newRec : null;
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.deleteRecommendation = deleteRecommendation;
const deletExtension = expressAsyncHandler(async (req, res) => {
    const { card_no, idx } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    let extensions = patient.recommendation?.extensions;
    const ext = extensions?.find((element) => element.idx === idx);
    if (!ext) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.EXT_NOT_EXIST);
    }
    extensions = extensions?.filter((element) => element.idx !== idx);
    patient.recommendation.extensions = extensions;
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.deletExtension = deletExtension;
const editExtension = expressAsyncHandler(async (req, res) => {
    const { extension } = req.body;
    const { card_no, idx } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    let extensions = patient.recommendation?.extensions;
    const extt = extensions?.find((element) => element.idx === idx);
    if (!extt) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.EXT_NOT_EXIST);
    }
    extensions = extensions?.map((ext) => ext.idx === idx ? {
        ...ext, ...extension
    } : ext);
    patient.recommendation.extensions = extensions;
    await patient.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.SAVED);
});
exports.editExtension = editExtension;
const deleteDianosis = expressAsyncHandler(async (req, res) => {
    const { card_no, idx } = req.params;
    const patient = await (0, model_1.findByCardNo)(card_no);
    if (!patient) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.PATIENT_NOT_EXIST);
    }
    const bodies = patient.body;
    const body = bodies.find((body) => body.idx === idx);
    if (!body) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.DIAG_NOT_EXIST);
    }
    const images = body.diagnosis.images;
    if (images.length > 0) {
        images.forEach(async (image) => {
            const result = await cloudinary_1.default.uploader.destroy(image.public_id);
            if (!result) {
                return res.status(StatusCodes_1.default.BadRequest).json(modal_1.DELETION_FAILED);
            }
        });
    }
    patient.body = bodies.filter((body) => body.idx !== idx);
    await patient.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "Deleted successfully"
    });
});
exports.deleteDianosis = deleteDianosis;
