"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyRole = exports.hasRole = exports.checkRole = exports.UserRole = void 0;
const ApiError_1 = require("../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
    UserRole["MANAGER"] = "manager";
})(UserRole || (exports.UserRole = UserRole = {}));
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user exists in request (should be set by auth middleware)
            if (!req.user) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'User not authenticated');
            }
            // Check if user has required role
            const userRole = req.user.role;
            if (!userRole || !allowedRoles.includes(userRole)) {
                throw new ApiError_1.ApiError(http_status_1.default.FORBIDDEN, 'You do not have permission to access this resource');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkRole = checkRole;
// Helper function to check if user has specific role
const hasRole = (user, role) => {
    return (user === null || user === void 0 ? void 0 : user.role) === role;
};
exports.hasRole = hasRole;
// Helper function to check if user has any of the specified roles
const hasAnyRole = (user, roles) => {
    return (user === null || user === void 0 ? void 0 : user.role) ? roles.includes(user.role) : false;
};
exports.hasAnyRole = hasAnyRole;
