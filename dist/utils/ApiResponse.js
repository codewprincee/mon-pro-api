"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static error(res, message, statusCode) {
        throw new Error('Method not implemented.');
    }
    static success(res, message = 'Success', data = null, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
}
exports.ApiResponse = ApiResponse;
