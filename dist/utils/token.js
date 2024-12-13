"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = void 0;
const ApiError_1 = require("./ApiError");
const http_status_1 = __importDefault(require("http-status"));
const extractTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Authentication required');
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid authentication format. Use Bearer token');
    }
    return token;
};
exports.extractTokenFromHeader = extractTokenFromHeader;
