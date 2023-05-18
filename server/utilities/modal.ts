const ERROR = { success: false, action: "error" }

const SUCCESS = { success: true, action: "success" }

const WARNING = { success: false, action: "warning" }

const ACCESS_DENIED = { ...ERROR, msg: "Access Denied" }

const INVALID_EMAIL = { ...ERROR, msg: "Invalid Email" }

const FIELDS_REQUIRED = { ...ERROR, msg: "All fields are required" }

const ACCOUNT_NOT_FOUND = { ...ERROR, msg: "Account does not exist." }

const PASSWORD_NOT_MATCH = { ...WARNING, msg: "Password does not match." }

export {
    FIELDS_REQUIRED, INVALID_EMAIL, ACCESS_DENIED, SUCCESS,
    PASSWORD_NOT_MATCH, ACCOUNT_NOT_FOUND, ERROR, WARNING,
}