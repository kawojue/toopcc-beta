const Error = {
    success: false,
    action: "error"
}

const Warning = {
    success: false,
    action: "warning"
}

const ACCESS_DENIED = {
    ...Error,
    message: "Access Denied"
}

const PASSWORD_NOT_MATCH = {
    ...Warning,
    msg: "Password does not match."
}

const FIELDS_REQUIRED = {
    ...Error,
    message: "All fields are required"
}

const INVALID_EMAIL = {
    ...Error,
    message: "Invalid Email"
}

export {
    ACCESS_DENIED, PASSWORD_NOT_MATCH,
    FIELDS_REQUIRED, INVALID_EMAIL,
}