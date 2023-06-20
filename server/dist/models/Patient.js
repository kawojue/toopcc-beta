"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PatientModel = new mongoose_1.Schema({
    card_no: {
        type: String,
        unique: true,
        sparse: true,
        required: true,
    },
    fullname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: ''
    },
    death: {
        dead: {
            type: Boolean,
            default: false
        },
        date: String,
    },
    phone_no: String,
    address: String,
    body: {
        type: [{
                idx: String,
                diagnosis: {
                    images: [{
                            secure_url: String,
                            public_id: String
                        }],
                    texts: String
                },
                date: {
                    type: String,
                    required: true
                },
                next_app: String
            }],
        default: []
    },
    recommendation: {
        opthalmology: {
            eligible: Boolean,
            medication: {
                type: [{
                        idx: String,
                        date: String,
                        next_app: String
                    }],
                default: []
            }
        },
        physiotherapy: {
            eligible: Boolean,
            medication: {
                type: [{
                        idx: String,
                        date: String,
                        next_app: String
                    }],
                default: []
            }
        },
        extensions: {
            type: [{
                    idx: String,
                    date: String,
                    name: String,
                    given: Boolean,
                    occurence: Number,
                }],
            default: []
        },
    }
});
const Patient = mongoose_1.default.model('Patient', PatientModel) || PatientModel;
exports.default = Patient;
