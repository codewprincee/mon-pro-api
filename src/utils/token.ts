import { Request } from 'express';
import { ApiError } from './ApiError';
import httpStatus from 'http-status';

export const extractTokenFromHeader = (req: Request): string => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authentication format. Use Bearer token');
    }

    return token;
};
