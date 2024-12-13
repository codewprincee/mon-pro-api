"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).max(100).optional(),
    role: zod_1.z.enum(['user', 'admin', 'manager']).optional(),
}).strict();
const validateUserUpdate = (data) => {
    try {
        return userUpdateSchema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, 'Invalid user data: ' + error.errors.map(e => e.message).join(', '));
        }
        throw error;
    }
};
exports.validateUserUpdate = validateUserUpdate;
