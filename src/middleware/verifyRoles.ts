import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { ApiError } from '../utils/ApiError';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    PREMIUM = 'premium'
}

export const verifyRoles = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req?.user?.role) {
            throw new ApiError(401, "No role specified");
        }

        const userRole = req.user.role as string;
        const hasRequiredRole = allowedRoles.some(role => role === userRole);

        if (!hasRequiredRole) {
            throw new ApiError(403, "You don't have permission to perform this action");
        }

        next();
    };
};
