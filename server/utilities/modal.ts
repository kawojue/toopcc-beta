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

const CURRENT_PSWD = { ...WARNING, msg: "Not saved! Same password." }

const SEX_REQUIRED = { ...WARNING, msg: "Sex is required." }

const PATIENT_NOT_EXIST = { ...ERROR, msg: "Patient does not exist." }

const CARD_NO_REQUIRED = { ...ERROR, msg: "Card number is required. "}

const INVALID_PHONE_NO = { ...WARNING, msg: "Invalid phone number" }

const INVALID_AGE = { ...WARNING, msg: "Age is not valid" }

const PSWD_CHANGED = { ...SUCCESS, msg: "Password updated successfully." }

const SAVED = { ...SUCCESS, msg: "Saved!" }

const PATIENT_EXIST = { ...WARNING, msg: "Patient with card number already exists." }

const DELETION_FAILED = {...ERROR, msg: "Failed to delete!" }

const CANCELED = { ...WARNING, msg: "Canceled." }

const EXT_NOT_EXIST = { ...ERROR, msg: "Extension does not exist. "}

const ROLES_UPDATED = { ...SUCCESS, msg: "Roles has been updated." }

export {
    FIELDS_REQUIRED, INVALID_EMAIL, ACCESS_DENIED, SUCCESS,
    PSWD_NOT_MATCH, ACCOUNT_NOT_FOUND, ERROR, WARNING,
    CURRENT_PSWD, INCORRECT_PSWD, PSWD_CHANGED,
    SMTH_WENT_WRONG, SEX_REQUIRED, CARD_NO_REQUIRED,
    INVALID_AGE, INVALID_PHONE_NO, PATIENT_NOT_EXIST,
    PATIENT_EXIST, SAVED, DELETION_FAILED,
    CANCELED, ROLES_UPDATED, EXT_NOT_EXIST
}