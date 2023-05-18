const ERROR = { success: false, action: "error" }

const SUCCESS = { success: true, action: "success" }

const WARNING = { success: false, action: "warning" }

const ACCESS_DENIED = { ...ERROR, msg: "Access Denied" }

const INVALID_EMAIL = { ...ERROR, msg: "Invalid Email" }

const INCORRECT_PSWD = { ...ERROR, msg: "Incorrect Password" }

const SMTH_WENT_WRONG = { ...ERROR, msg: "Something went wrong. "}

const FIELDS_REQUIRED = { ...ERROR, msg: "All fields are required" }

const ACCOUNT_NOT_FOUND = { ...ERROR, msg: "Account does not exist." }

const PSWD_NOT_MATCH = { ...WARNING, msg: "Password does not match." }

const CURRENT_PSWD = { ...WARNING, msg: "You input your current password." }

const PSWD_CHANGED = { ...SUCCESS, msg: "Password updated successfully." }

export {
    FIELDS_REQUIRED, INVALID_EMAIL, ACCESS_DENIED, SUCCESS,
    PSWD_NOT_MATCH, ACCOUNT_NOT_FOUND, ERROR, WARNING,
    CURRENT_PSWD, INCORRECT_PSWD, PSWD_CHANGED,
    SMTH_WENT_WRONG,
}