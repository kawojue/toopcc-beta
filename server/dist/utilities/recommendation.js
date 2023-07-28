"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMedic = exports.addExtension = void 0;
const uuid_1 = require("uuid");
const full_name_1 = __importDefault(require("./full_name"));
const genNextApp_1 = __importDefault(require("./genNextApp"));
function addExtension(extensions, ext) {
    const formattedName = (0, full_name_1.default)(ext.name);
    const findByName = extensions.find((extension) => extension.name === formattedName);
    if (findByName)
        return [...extensions];
    const newExtensions = [
        ...extensions,
        {
            idx: (0, uuid_1.v4)(),
            date: ext?.date,
            name: formattedName,
            occurence: ext?.occurence ? ext?.occurence : 1,
            given: ext?.given === undefined || null ? false : ext?.given
        }
    ];
    return newExtensions;
}
exports.addExtension = addExtension;
function addMedic(recc, medics) {
    return recc?.date ? [
        ...medics,
        {
            idx: (0, uuid_1.v4)(),
            date: recc.date,
            next_app: recc?.next_app ? recc.next_app : (0, genNextApp_1.default)(recc.date),
        }
    ] : [...medics];
}
exports.addMedic = addMedic;
