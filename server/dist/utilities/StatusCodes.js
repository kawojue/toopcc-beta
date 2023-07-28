"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    StatusCodes[StatusCodes["Created"] = 201] = "Created";
    StatusCodes[StatusCodes["Accepted"] = 202] = "Accepted";
    StatusCodes[StatusCodes["NoContent"] = 204] = "NoContent";
    StatusCodes[StatusCodes["NotModified"] = 304] = "NotModified";
    StatusCodes[StatusCodes["BadRequest"] = 400] = "BadRequest";
    StatusCodes[StatusCodes["Unauthorized"] = 401] = "Unauthorized";
    StatusCodes[StatusCodes["Forbidden"] = 403] = "Forbidden";
    StatusCodes[StatusCodes["NotFound"] = 404] = "NotFound";
    StatusCodes[StatusCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    StatusCodes[StatusCodes["Conflict"] = 409] = "Conflict";
    StatusCodes[StatusCodes["PayloadTooLarge"] = 413] = "PayloadTooLarge";
    StatusCodes[StatusCodes["TooManyRequest"] = 429] = "TooManyRequest";
})(StatusCodes || (StatusCodes = {}));
exports.default = StatusCodes;
