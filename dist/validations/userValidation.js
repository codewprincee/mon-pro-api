"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
exports.userValidation = {
    getUserById: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
    },
    createUser: {
        body: zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email(),
            // Add other validation rules
        }),
    },
    updateUser: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
        body: zod_1.z.object({
            name: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
        }),
    },
    deleteUser: {
        params: zod_1.z.object({
            id: zod_1.z.string(),
        }),
    },
};
