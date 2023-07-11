"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkRoles(authRoles, roles) {
    if (!authRoles || !roles)
        return false;
    const result = roles.map((role) => authRoles.includes(role)).find((value) => value === true);
    if (!result)
        return false;
    return true;
}
exports.default = checkRoles;
