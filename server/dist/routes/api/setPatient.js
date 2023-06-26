"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patients_1 = require("../../controllers/patients");
const jwtVerify_1 = __importDefault(require("../../middlewares/jwtVerify"));
const verifyRoles_1 = __importDefault(require("../../middlewares/verifyRoles"));
const patients = (0, express_1.Router)();
// only admin and hr have access to do these.
patients.use([jwtVerify_1.default, (0, verifyRoles_1.default)("admin", "hr")]);
// add, edit, and delete patient data routes
patients.post('/add', patients_1.add);
patients.route('/patient/:card_no')
    .put(patients_1.edit)
    .delete(patients_1.remove);
// add, edit, and delete patient diagnosis routes
patients.post('/diagnosis/:card_no', patients_1.addDiagnosis);
patients.route('/diagnosis/:card_no/:idx')
    .put(patients_1.editDiagnosis)
    .delete(patients_1.deleteDianosis);
// update and delete patient referral or recommendation routes
patients.put('/recommendation/:card_no', patients_1.addRecommendation);
patients.delete('/recommendation/:card_no/:idx', patients_1.deleteRecommendation);
// update and delete patient extension routes
patients.route('/recommendation/extension/:card_no/:idx')
    .put(patients_1.editExtension)
    .delete(patients_1.deletExtension);
exports.default = patients;
