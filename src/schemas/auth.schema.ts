import Joi from 'joi';
import { Auth } from '../interfaces/auth.interface';

// Login schema matches Auth interface
export const loginSchema = Joi.object<Auth>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Register schema extends Auth interface
export const registerSchema = Joi.object<Auth & {
    firstName: string;
    lastName: string;
}>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
});

// Schema for refresh token endpoint
export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
}); 