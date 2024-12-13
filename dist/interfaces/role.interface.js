"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidRole = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
const isValidRole = (role) => {
    return Object.values(UserRole).includes(role);
};
exports.isValidRole = isValidRole;
