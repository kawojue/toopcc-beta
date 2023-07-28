"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRole = exports.changeRoles = exports.resigned = exports.editFullname = exports.editUsername = exports.editPassword = exports.changeAvatar = exports.verifyOTP = exports.logout = exports.createUser = exports.deleteAvatar = exports.otpHandler = exports.login = exports.resetpswd = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const randomstring_1 = __importDefault(require("randomstring"));
const mailer_1 = __importDefault(require("../utilities/mailer"));
const genOTP_1 = __importDefault(require("../utilities/genOTP"));
const genToken_1 = __importDefault(require("../utilities/genToken"));
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const full_name_1 = __importDefault(require("../utilities/full_name"));
const model_1 = require("../utilities/model");
const StatusCodes_1 = __importDefault(require("../utilities/StatusCodes"));
const modal_1 = require("../utilities/modal");
const asyncHandler = require('express-async-handler');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
// handle account creation
const createUser = asyncHandler(async (req, res) => {
    let user;
    let result;
    let { email, pswd, pswd2, fullname, avatar } = req.body;
    if (!email || !pswd || !pswd2 || !fullname) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    fullname = (0, full_name_1.default)(fullname);
    email = email?.toLowerCase()?.trim();
    if (pswd !== pswd2) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.PSWD_NOT_MATCH);
    }
    if (EMAIL_REGEX.test(email) === false) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.INVALID_EMAIL);
    }
    user = email.split('@')[0];
    const account = await (0, model_1.findByEmail)(email);
    if (account) {
        return res.status(StatusCodes_1.default.Conflict).json({
            ...modal_1.ERROR,
            msg: "Account already exists."
        });
    }
    const userExists = await (0, model_1.findByUser)(user);
    if (!USER_REGEX.test(user) || userExists) {
        const rand = randomstring_1.default.generate({
            length: parseInt('657'[Math.floor(Math.random() * 3)]),
            charset: 'alphabetic'
        });
        user = rand?.toLowerCase()?.trim();
    }
    const salt = await bcrypt_1.default.genSalt(10);
    pswd = await bcrypt_1.default.hash(pswd, salt);
    if (avatar) {
        result = await cloudinary_1.default.uploader.upload(avatar, {
            folder: `TOOPCC/Staffs/Avatars`,
            resource_type: 'image'
        });
        if (!result) {
            return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
        }
    }
    await model_1.User.create({
        user,
        email,
        fullname,
        password: pswd,
        avatar: {
            secure_url: result?.secure_url,
            public_id: result?.public_id
        }
    });
    res.status(StatusCodes_1.default.Created).json({
        ...modal_1.SUCCESS,
        msg: "Account creation was successful."
    });
});
exports.createUser = createUser;
// handle Login
const login = asyncHandler(async (req, res) => {
    let { userId, pswd } = req.body;
    userId = userId?.toLowerCase()?.trim();
    if (!userId || !pswd) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    const account = EMAIL_REGEX.test(userId) ? await (0, model_1.findByEmail)(userId) : await (0, model_1.findByUser)(userId);
    if (!account) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "Invalid User ID or Password."
        });
    }
    if (account.resigned?.resign) {
        return res.status(StatusCodes_1.default.Unauthorized).json(modal_1.ACCESS_DENIED);
    }
    const match = await bcrypt_1.default.compare(pswd, account.password);
    if (!match) {
        return res.status(StatusCodes_1.default.Unauthorized).json(modal_1.INCORRECT_PSWD);
    }
    const token = (0, genToken_1.default)(account.user, account.roles);
    account.token = token;
    account.lastLogin = `${new Date().toISOString()}`;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        token,
        ...modal_1.SUCCESS,
        msg: "Login successful.",
    });
});
exports.login = login;
// send otp to user
const otpHandler = asyncHandler(async (req, res) => {
    let { email } = req.body;
    email = email?.trim()?.toLowerCase();
    const { totp, totpDate } = (0, genOTP_1.default)();
    if (!email) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.INVALID_EMAIL);
    }
    const account = await (0, model_1.findByEmail)(email);
    if (!account) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "There is no account associated with this email."
        });
    }
    if (account.resigned?.resign) {
        return res.status(StatusCodes_1.default.Unauthorized).json(modal_1.ACCESS_DENIED);
    }
    const transportMail = {
        senderName: "Admin at TOOPCC",
        to: email,
        subject: "Verification Code",
        text: `Code: ${totp}\nIf you did not request for this OTP. Please, ignore.`
    };
    const sendMail = await (0, mailer_1.default)(transportMail);
    if (!sendMail) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.INVALID_EMAIL);
    }
    account.totp = totp;
    account.totp_date = totpDate;
    account.email_verified = false;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "OTP has been sent to your email."
    });
});
exports.otpHandler = otpHandler;
// change username
const editUsername = asyncHandler(async (req, res) => {
    let { newUser } = req.body;
    newUser = newUser?.trim()?.toLowerCase();
    if (!newUser) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    if (!USER_REGEX.test(newUser)) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "Username is not allowed."
        });
    }
    const account = await (0, model_1.findByUser)(req.user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
    }
    const userExists = await (0, model_1.findByUser)(newUser);
    if (userExists) {
        return res.status(StatusCodes_1.default.Conflict).json({
            ...modal_1.ERROR,
            msg: "Username has been taken."
        });
    }
    account.token = "";
    account.user = newUser;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "You've successfully changed your username."
    });
});
exports.editUsername = editUsername;
const editFullname = asyncHandler(async (req, res) => {
    let { fullname } = req.body;
    fullname = (0, full_name_1.default)(fullname);
    if (!fullname) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    const account = await (0, model_1.findByUser)(req.user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
    }
    account.fullname = fullname;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "You've successfully changed your fullname."
    });
});
exports.editFullname = editFullname;
const logout = asyncHandler(async (req, res) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.sendStatus(StatusCodes_1.default.NoContent);
    }
    const token = authHeader.split(' ')[1];
    const account = await (0, model_1.findByToken)(token);
    if (!account) {
        return res.sendStatus(StatusCodes_1.default.NoContent);
    }
    account.token = "";
    await account.save();
    res.sendStatus(StatusCodes_1.default.NoContent);
});
exports.logout = logout;
// verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;
    if (!otp || !email) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    const account = await (0, model_1.findByEmail)(email);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
    }
    const totp = account.totp;
    const totpDate = account.totp_date;
    const expiry = totpDate + (60 * 60 * 1000); // after 1hr
    if (expiry < Date.now()) {
        account.totp = null;
        account.totp_date = null;
        account.email_verified = false;
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "OTP has expired."
        });
    }
    if (totp !== otp) {
        return res.status(StatusCodes_1.default.Unauthorized).json({
            ...modal_1.ERROR,
            msg: "Incorrect OTP."
        });
    }
    account.totp = null;
    account.totp_date = null;
    account.email_verified = false;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        email,
        verified: true,
        user: account.user
    });
});
exports.verifyOTP = verifyOTP;
// reset password
const resetpswd = asyncHandler(async (req, res) => {
    const { verified, email, newPswd, newPswd2 } = req.body;
    if (!email || !newPswd) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    if (newPswd !== newPswd2) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.PSWD_NOT_MATCH);
    }
    const account = await (0, model_1.findByEmail)(email);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.ACCOUNT_NOT_FOUND);
    }
    if (!verified || !account.email_verified || account.resigned?.resign) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.ACCESS_DENIED);
    }
    const compare = await bcrypt_1.default.compare(newPswd, account.password);
    if (compare) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.CURRENT_PSWD);
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPswd = await bcrypt_1.default.hash(newPswd, salt);
    account.token = "";
    account.password = hashedPswd;
    account.email_verified = false;
    await account.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.PSWD_CHANGED);
});
exports.resetpswd = resetpswd;
const editPassword = asyncHandler(async (req, res) => {
    const { currentPswd, pswd, pswd2 } = req.body;
    if (!currentPswd || !pswd || !pswd2) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.FIELDS_REQUIRED);
    }
    if (!currentPswd) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: 'Old password is required.'
        });
    }
    if (pswd !== pswd2) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.PSWD_NOT_MATCH);
    }
    if (currentPswd === pswd) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.CURRENT_PSWD);
    }
    const account = await (0, model_1.findByUser)(req.user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
    }
    const isMatch = await bcrypt_1.default.compare(currentPswd, account.password);
    if (!isMatch) {
        return res.status(StatusCodes_1.default.Unauthorized).json(modal_1.INCORRECT_PSWD);
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPswd = await bcrypt_1.default.hash(pswd, salt);
    account.token = "";
    account.password = hashedPswd;
    await account.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.PSWD_CHANGED);
});
exports.editPassword = editPassword;
const changeAvatar = asyncHandler(async (req, res) => {
    const { avatar } = req.body;
    if (!avatar) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.SMTH_WENT_WRONG);
    }
    const account = await (0, model_1.findByUser)(req.user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
    }
    if (account.avartar?.secure_url) {
        const res = await cloudinary_1.default.uploader.destroy(account.avartar?.public_id);
        if (!res) {
            return res.status(StatusCodes_1.default.BadRequest).json(modal_1.SMTH_WENT_WRONG);
        }
    }
    const result = await cloudinary_1.default.uploader.upload(avatar, {
        folder: `TOOPCC/Staffs/Avatars`,
        resource_type: 'image'
    });
    if (!result) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.SMTH_WENT_WRONG);
    }
    account.secure_url = result.secure_url,
        account.public_id = result.public_id;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "Successful."
    });
});
exports.changeAvatar = changeAvatar;
const deleteAvatar = asyncHandler(async (req, res) => {
    const account = await (0, model_1.findByUser)(req.user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.SMTH_WENT_WRONG);
    }
    const result = await cloudinary_1.default.uploader.destroy(account.avartar?.public_id);
    if (!result) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.SMTH_WENT_WRONG);
    }
    account.secure_url = null,
        account.public_id = null;
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "Successful."
    });
});
exports.deleteAvatar = deleteAvatar;
const resigned = asyncHandler(async (req, res) => {
    const { user } = req.params;
    const { resign, date } = req.body;
    const account = await (0, model_1.findByUser)(user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.ACCOUNT_NOT_FOUND);
    }
    if (Boolean(resign) === false) {
        account.resigned = {
            date: "",
            resign: false
        };
    }
    if (Boolean(resign) === true && !date) {
        account.resigned = {
            date: `${new Date().toISOString()}`,
            resign: true
        };
    }
    account.resigned = { date, resign };
    await account.save();
    res.status(StatusCodes_1.default.OK).json({
        ...modal_1.SUCCESS,
        msg: "Staff has been resigned"
    });
});
exports.resigned = resigned;
const changeRoles = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const { user } = req.params;
    if (!role) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.CANCELED);
    }
    const account = await (0, model_1.findByUser)(user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.ACCOUNT_NOT_FOUND);
    }
    const roles = account.roles;
    if (roles.includes(role)) {
        return res.status(StatusCodes_1.default.OK).json({
            ...modal_1.SUCCESS,
            msg: "Existing roles"
        });
    }
    roles.push(role);
    account.token = "";
    account.roles = roles;
    await account.save();
    res.status(StatusCodes_1.default.OK).json(modal_1.ROLES_UPDATED);
});
exports.changeRoles = changeRoles;
const removeRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const { user } = req.params;
    if (!role) {
        return res.status(StatusCodes_1.default.BadRequest).json(modal_1.CANCELED);
    }
    const account = await (0, model_1.findByUser)(user);
    if (!account) {
        return res.status(StatusCodes_1.default.NotFound).json(modal_1.ACCOUNT_NOT_FOUND);
    }
    const roles = account.roles;
    if (!roles.includes(role)) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "Role does not exist."
        });
    }
    const newRoles = roles.filter((authRole) => authRole !== role);
    if (newRoles.length === 0) {
        return res.status(StatusCodes_1.default.BadRequest).json({
            ...modal_1.ERROR,
            msg: "Empty role! Cannot remove role."
        });
    }
    account.token = "";
    account.roles = newRoles;
    res.status(StatusCodes_1.default.OK).json(modal_1.ROLES_UPDATED);
});
exports.removeRole = removeRole;
