"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const ApiError_1 = require("../utils/ApiError");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const validationSegments = ['params', 'query', 'body'];
        try {
            for (const segment of validationSegments) {
                if (schema[segment]) {
                    const { error } = schema[segment].validate(req[segment]);
                    if (error) {
                        throw new ApiError_1.ApiError(400, error.details[0].message);
                    }
                }
            }
            next();
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
