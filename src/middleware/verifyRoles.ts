import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../interfaces/role.interface';

export { UserRole };

export const verifyRoles = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req?.user?.role) {
            throw new ApiError(401, "No role specified");
        }

        const userRole = req.user.role;
        const hasRequiredRole = allowedRoles.some(role => role === userRole);

        if (!hasRequiredRole) {
            throw new ApiError(403, "You don't have permission to perform this action");
        }

        next();
    };
};
