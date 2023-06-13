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
exports.removeRole = exports.changeRoles = exports.resigned = exports.editFullname = exports.editUsername = exports.editPassword = exports.changeAvatar = exports.verifyOTP = exports.logout = exports.createUser = exports.deleteAvatar = exports.otpHandler = exports.login = exports.resetpswd = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const randomstring_1 = __importDefault(require("randomstring"));
const mailer_1 = __importDefault(require("../utilities/mailer"));
const genOTP_1 = __importDefault(require("../utilities/genOTP"));
const genToken_1 = __importDefault(require("../utilities/genToken"));
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const full_name_1 = __importDefault(require("../utilities/full_name"));
const getModels_1 = require("../utilities/getModels");
const modal_1 = require("../utilities/modal");
const asyncHandler = require('express-async-handler');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
// handle account creation
const createUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let user;
    let result;
    let { email, pswd, pswd2, fullname, avatar } = req.body;
    if (!email || !pswd || !pswd2 || !fullname)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    fullname = (0, full_name_1.default)(fullname);
    email = (_a = email === null || email === void 0 ? void 0 : email.toLowerCase()) === null || _a === void 0 ? void 0 : _a.trim();
    if (pswd !== pswd2)
        return res.status(400).json(modal_1.PSWD_NOT_MATCH);
    if (EMAIL_REGEX.test(email) === false)
        return res.status(400).json(modal_1.INVALID_EMAIL);
    user = email.split('@')[0];
    const account = yield (0, getModels_1.fetchUserByEmail)(email);
    if (account) {
        return res.status(409).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Account already exists." }));
    }
    const isUserExists = yield (0, getModels_1.fetchUserByUser)(user);
    if (!USER_REGEX.test(user) || isUserExists) {
        const rand = randomstring_1.default.generate({
            length: parseInt('657'[Math.floor(Math.random() * 3)]),
            charset: 'alphabetic'
        });
        user = (_b = rand === null || rand === void 0 ? void 0 : rand.toLowerCase()) === null || _b === void 0 ? void 0 : _b.trim();
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    pswd = yield bcrypt_1.default.hash(pswd, salt);
    if (avatar) {
        result = yield cloudinary_1.default.uploader.upload(avatar, {
            folder: `TOOPCC/Staffs/Avatars`,
            resource_type: 'image'
        });
        if (!result)
            return res.status(404).json(modal_1.SMTH_WENT_WRONG);
    }
    yield User_1.default.create({
        user,
        avatar: {
            secure_url: result === null || result === void 0 ? void 0 : result.secure_url,
            public_id: result === null || result === void 0 ? void 0 : result.public_id
        },
        password: pswd,
        fullname: fullname,
        'mail.email': email
    });
    res.status(201).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Account creation was successful." }));
}));
exports.createUser = createUser;
// handle Login
const login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let { userId, pswd } = req.body;
    userId = (_c = userId === null || userId === void 0 ? void 0 : userId.toLowerCase()) === null || _c === void 0 ? void 0 : _c.trim();
    if (!userId || !pswd)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    const account = yield User_1.default.findOne(EMAIL_REGEX.test(userId) ?
        { 'mail.email': userId } : { user: userId }).exec();
    if (!account) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Invalid User ID or Password." }));
    }
    if (account.resigned.resign)
        return res.status(401).json(modal_1.ACCESS_DENIED);
    const match = yield bcrypt_1.default.compare(pswd, account.password);
    if (!match)
        return res.status(401).json(modal_1.INCORRECT_PSWD);
    const token = (0, genToken_1.default)(account.user, account.roles);
    account.token = token;
    account.lastLogin = `${new Date()}`;
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({ token }, modal_1.SUCCESS), { msg: "Login successful." }));
}));
exports.login = login;
// send otp to user
const otpHandler = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    let { email } = req.body;
    email = (_d = email === null || email === void 0 ? void 0 : email.trim()) === null || _d === void 0 ? void 0 : _d.toLowerCase();
    const { totp, totpDate } = (0, genOTP_1.default)();
    if (!email)
        return res.status(400).json(modal_1.INVALID_EMAIL);
    const account = yield (0, getModels_1.fetchUserByEmail)(email);
    if (!account) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "There is no account associated with this email." }));
    }
    if (account.resigned.resign)
        return res.status(401).json(modal_1.ACCESS_DENIED);
    account.OTP.totp = totp;
    account.OTP.totpDate = totpDate;
    account.mail.verified = false;
    yield account.save();
    const transportMail = {
        senderName: "Admin at TOOPCC",
        to: email,
        subject: "Verification Code",
        text: `Code: ${totp}\nIf you did not request for this OTP. Please, ignore.`
    };
    const sendMail = yield (0, mailer_1.default)(transportMail);
    if (!sendMail)
        return res.status(400).json(modal_1.INVALID_EMAIL);
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "OTP has been sent to your email." }));
}));
exports.otpHandler = otpHandler;
// change username
const editUsername = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    let { newUser } = req.body;
    newUser = (_e = newUser === null || newUser === void 0 ? void 0 : newUser.trim()) === null || _e === void 0 ? void 0 : _e.toLowerCase();
    if (!newUser)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    if (!USER_REGEX.test(newUser)) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Username is not allowed." }));
    }
    const account = yield (0, getModels_1.fetchUserByUser)(req === null || req === void 0 ? void 0 : req.user);
    if (!account)
        return res.status(404).json(modal_1.SMTH_WENT_WRONG);
    const userExists = yield (0, getModels_1.fetchUserByUser)(newUser);
    if (userExists) {
        return res.status(409).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Username has been taken." }));
    }
    account.token = "";
    account.user = newUser;
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "You've successfully changed your username." }));
}));
exports.editUsername = editUsername;
const editFullname = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { fullname } = req.body;
    if (!fullname)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    fullname = (0, full_name_1.default)(fullname);
    const account = yield (0, getModels_1.fetchUserByUser)(req === null || req === void 0 ? void 0 : req.user);
    if (!account)
        return res.status(404).json(modal_1.SMTH_WENT_WRONG);
    account.fullname = fullname;
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "You've successfully changed your full name." }));
}));
exports.editFullname = editFullname;
const logout = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const authHeader = (_f = req.headers) === null || _f === void 0 ? void 0 : _f.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.sendStatus(204);
    }
    const token = authHeader.split(' ')[1];
    const account = yield User_1.default.findOne({ token }).exec();
    if (!account) {
        return res.sendStatus(204);
    }
    account.token = "";
    yield account.save();
    res.sendStatus(204);
}));
exports.logout = logout;
// verify OTP
const verifyOTP = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = req.body;
    if (!otp || !email)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    const account = yield (0, getModels_1.fetchUserByEmail)(email);
    const totp = account.OTP.totp;
    const totpDate = account.OTP.totpDate;
    const expiry = totpDate + (60 * 60 * 1000); // after 1hr
    if (expiry < Date.now()) {
        account.OTP = {};
        yield account.save();
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "OTP Expired." }));
    }
    if (totp !== otp) {
        return res.status(401).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Incorrect OTP" }));
    }
    account.OTP = {};
    account.mail.verified = true;
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { verified: true, email, user: account.user }));
}));
exports.verifyOTP = verifyOTP;
// reset password
const resetpswd = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verified, email, newPswd, newPswd2 } = req.body;
    if (!email || !newPswd)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    if (newPswd !== newPswd2)
        return res.status(400).json(modal_1.PSWD_NOT_MATCH);
    const account = yield (0, getModels_1.fetchUserByEmail)(email);
    if (!account)
        return res.status(404).json(modal_1.ACCOUNT_NOT_FOUND);
    if (!verified || !account.mail.verified || account.resigned.resign)
        return res.status(400).json(modal_1.ACCESS_DENIED);
    const compare = yield bcrypt_1.default.compare(newPswd, account.password);
    if (compare)
        return res.status(400).json(modal_1.CURRENT_PSWD);
    const salt = yield bcrypt_1.default.genSalt(10);
    const hasedPswd = yield bcrypt_1.default.hash(newPswd, salt);
    account.token = "";
    account.password = hasedPswd;
    account.mail.verified = false;
    yield account.save();
    res.status(200).json(modal_1.PSWD_CHANGED);
}));
exports.resetpswd = resetpswd;
const editPassword = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPswd, pswd, pswd2 } = req.body;
    if (!currentPswd || !pswd || !pswd2)
        return res.status(400).json(modal_1.FIELDS_REQUIRED);
    if (!currentPswd) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: 'Old password is required.' }));
    }
    if (pswd !== pswd2)
        return res.status(400).json(modal_1.PSWD_NOT_MATCH);
    if (currentPswd === pswd)
        return res.status(400).json(modal_1.CURRENT_PSWD);
    const account = yield (0, getModels_1.fetchUserByUser)(req === null || req === void 0 ? void 0 : req.user);
    if (!account)
        return res.status(404).json(modal_1.SMTH_WENT_WRONG);
    const isMatch = yield bcrypt_1.default.compare(currentPswd, account.password);
    if (!isMatch)
        return res.status(401).json(modal_1.INCORRECT_PSWD);
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPswd = yield bcrypt_1.default.hash(pswd, salt);
    account.token = "";
    account.password = hashedPswd;
    yield account.save();
    res.status(200).json(modal_1.PSWD_CHANGED);
}));
exports.editPassword = editPassword;
const changeAvatar = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { avatar } = req.body;
    if (!avatar)
        return res.status(400).json(modal_1.SMTH_WENT_WRONG);
    const account = yield (0, getModels_1.fetchUserByUser)(req === null || req === void 0 ? void 0 : req.user);
    if (!account)
        return res.status(404).json(modal_1.SMTH_WENT_WRONG);
    if (account.avatar.secure_url) {
        const res = yield cloudinary_1.default.uploader.destroy(account.avatar.public_id);
        if (!res)
            return res.status(400).json(modal_1.SMTH_WENT_WRONG);
    }
    const result = yield cloudinary_1.default.uploader.upload(avatar, {
        folder: `TOOPCC/Staffs/Avatars`,
        resource_type: 'image'
    });
    if (!result)
        return res.status(400).json(modal_1.SMTH_WENT_WRONG);
    account.avatar = {
        secure_url: result.secure_url,
        public_id: result.public_id
    };
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Successful." }));
}));
exports.changeAvatar = changeAvatar;
const deleteAvatar = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const account = yield (0, getModels_1.fetchUserByUser)(req === null || req === void 0 ? void 0 : req.user);
    if (!account)
        return res.status(404).json(modal_1.SMTH_WENT_WRONG);
    const result = yield cloudinary_1.default.uploader.destroy((_g = account.avatar) === null || _g === void 0 ? void 0 : _g.public_id);
    if (!result)
        return res.status(400).json(modal_1.SMTH_WENT_WRONG);
    account.avatar = {
        secure_url: "",
        public_id: ""
    };
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Successful." }));
}));
exports.deleteAvatar = deleteAvatar;
const resigned = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.params;
    const { resign, date } = req.body;
    const account = yield (0, getModels_1.fetchUserByUser)(user);
    if (!account)
        return res.status(404).json(modal_1.ACCOUNT_NOT_FOUND);
    if (Boolean(resign) === false) {
        account.resigned.date = "";
    }
    if (Boolean(resign) === true && !date) {
        account.resigned.date = `${new Date().toISOString()}`;
    }
    account.resigned.date = date;
    account.resigned.resign = Boolean(resign);
    yield account.save();
    res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Staff has been resigned" }));
}));
exports.resigned = resigned;
const changeRoles = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.body;
    const { user } = req.params;
    if (!role)
        return res.status(400).json(modal_1.CANCELED);
    const account = yield (0, getModels_1.fetchUserByUser)(user);
    if (!account)
        return res.status(404).json(modal_1.ACCOUNT_NOT_FOUND);
    const roles = account.roles;
    if (roles.includes(role)) {
        return res.status(200).json(Object.assign(Object.assign({}, modal_1.SUCCESS), { msg: "Existing roles" }));
    }
    roles.push(role);
    account.roles = roles;
    account.token = "";
    yield account.save();
    res.status(200).json(modal_1.ROLES_UPDATED);
}));
exports.changeRoles = changeRoles;
const removeRole = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = req.body;
    const { user } = req.params;
    if (!role)
        return res.status(400).json(modal_1.CANCELED);
    const account = yield (0, getModels_1.fetchUserByUser)(user);
    if (!account)
        return res.status(404).json(modal_1.ACCOUNT_NOT_FOUND);
    const roles = account.roles;
    if (!roles.includes(role)) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Role does not exist." }));
    }
    const newRoles = roles.filter((authRole) => authRole !== role);
    if (newRoles.length === 0) {
        return res.status(400).json(Object.assign(Object.assign({}, modal_1.ERROR), { msg: "Empty roles! Cannot remove role." }));
    }
    account.token = "";
    account.roles = newRoles;
    yield account.save();
    res.status(200).json(modal_1.ROLES_UPDATED);
}));
exports.removeRole = removeRole;
