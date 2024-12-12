import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

// No need to load dotenv here since it's already loaded in index.ts

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role?: string;
            };
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
        }

        try {
            const decoded = jwt.verify(token, 'secret') as unknown as {
                id: string;
                email: string;
                role?: string;
            };

            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Token expired');
            }
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
        }
    } catch (error) {
        next(error);
    }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
        }

        if (!req.user.role || !roles.includes(req.user.role)) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                'You do not have permission to perform this action'
            );
        }

        next();
    };
};
