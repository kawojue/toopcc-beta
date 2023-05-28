"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuth_1 = require("../../controllers/userAuth");
const avatar = (0, express_1.Router)();
avatar.route('/')
    .post(userAuth_1.addAvatar)
    .get(userAuth_1.deleteAvatar);
exports.default = avatar;
