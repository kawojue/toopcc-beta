const ACCESS_DENIED = {
    success: false,
    action: "error",
    message: "Access Denied."
}

const PASSWORD_NOT_MATCH = {
    success: false,
    action: "warning",
    msg: "Password does not match."
}

const FIELDS_REQUIRED = {
    success: false,
    action: "error",
    message: "All fields are required"
}

export {
    ACCESS_DENIED, FIELDS_REQUIRED, PASSWORD_NOT_MATCH,
}