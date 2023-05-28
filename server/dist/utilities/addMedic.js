"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const genNextApp_1 = __importDefault(require("./genNextApp"));
function addMedic(recc, medics) {
    return (recc === null || recc === void 0 ? void 0 : recc.date) ? [
        ...medics,
        {
            idx: (0, uuid_1.v4)(),
            date: recc.date,
            next_app: (recc === null || recc === void 0 ? void 0 : recc.next_app) ? recc.next_app : (0, genNextApp_1.default)(recc.date),
        }
    ] : [...medics];
}
exports.default = addMedic;
