"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
exports.authValidation = {
    register: {
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format'),
            password: zod_1.z.string()
                .min(8, 'Password must be at least 8 characters')
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
            firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
            lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
        }),
    },
    login: {
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format'),
            password: zod_1.z.string().min(1, 'Password is required'),
        }),
    },
    refreshToken: {
        body: zod_1.z.object({
            refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
        }),
    },
};
