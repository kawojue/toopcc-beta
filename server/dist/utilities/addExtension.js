"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const full_name_1 = __importDefault(require("./full_name"));
function addExtension(extensions, ext) {
    const formattedName = (0, full_name_1.default)(ext.name);
    const findByName = extensions.find((extension) => extension.name === formattedName);
    if (findByName)
        return [...extensions];
    const newExtensions = [
        ...extensions,
        {
            idx: (0, uuid_1.v4)(),
            date: ext === null || ext === void 0 ? void 0 : ext.date,
            name: formattedName,
            occurence: (ext === null || ext === void 0 ? void 0 : ext.occurence) ? ext === null || ext === void 0 ? void 0 : ext.occurence : 1,
            given: (ext === null || ext === void 0 ? void 0 : ext.given) === undefined ? false : ext === null || ext === void 0 ? void 0 : ext.given
        }
    ];
    return newExtensions;
}
exports.default = addExtension;
