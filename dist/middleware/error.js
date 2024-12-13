"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const ApiError_1 = require("../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        const statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal Server Error';
        error = new ApiError_1.ApiError(statusCode, message);
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;
    const response = Object.assign({ success: false, message }, (process.env.NODE_ENV === 'development' && { stack: err.stack }));
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
