"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const role_interface_1 = require("../interfaces/role.interface");
const token_1 = require("../utils/token");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract token using utility function
        const token = (0, token_1.extractTokenFromHeader)(req);
        const accessSecret = process.env.JWT_ACCESS_SECRET || 'my_secret';
        console.log("Access Secret", accessSecret);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, accessSecret);
            // Verify token hasn't expired
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Token has expired');
            }
            // Validate required fields
            if (!decoded._id || !decoded.email) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid token payload');
            }
            // Validate role
            if (!decoded.role || !(0, role_interface_1.isValidRole)(decoded.role)) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid user role');
            }
            req.user = {
                _id: decoded._id,
                email: decoded.email,
                role: decoded.role,
                iat: decoded.iat,
                exp: decoded.exp
            };
            next();
        }
        catch (error) {
            console.error('Token verification error:', error);
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Token has expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid token');
            }
            else if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Authentication failed');
        }
    }
    catch (error) {
        next(error);
    }
});
exports.auth = auth;
const requireRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Authentication required');
            }
            if (!roles.includes(req.user.role)) {
                throw new ApiError_1.ApiError(http_status_1.default.FORBIDDEN, 'You do not have permission to perform this action');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
