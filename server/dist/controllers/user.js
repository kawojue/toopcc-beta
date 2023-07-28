"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = exports.getProfile = void 0;
const modal_1 = require("../utilities/modal");
const model_1 = require("../utilities/model");
const expressAsyncHandler = require('express-async-handler');
const getProfile = expressAsyncHandler(async (req, res) => {
    const profile = await (0, model_1.fetchUsers)('-totp -email_verified -totp_date -token -password');
    res.status(200).json({ ...modal_1.SUCCESS, profile });
});
exports.getProfile = getProfile;
const getUsers = expressAsyncHandler(async (req, res) => {
    const users = await (0, model_1.fetchUsers)('-totp -email_verified -totp_date -token -password');
    const names = users.map((user) => {
        return { username: user.user, fullname: user.fullname };
    });
    res.status(200).json({ ...modal_1.SUCCESS, names });
});
exports.getUsers = getUsers;
const getUser = expressAsyncHandler(async (req, res) => {
    const { user: userParam } = req.params;
    const user = await (0, model_1.findByUser)(userParam, '-totp -email_verified -totp_date -token -password');
    res.status(200).json({ ...modal_1.SUCCESS, user });
});
exports.getUser = getUser;
