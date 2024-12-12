import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager'
}

export const checkRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if user exists in request (should be set by auth middleware)
            if (!req.user) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
            }

            // Check if user has required role
            const userRole = req.user.role as UserRole;
            if (!userRole || !allowedRoles.includes(userRole)) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    'You do not have permission to access this resource'
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Helper function to check if user has specific role
export const hasRole = (user: Express.Request['user'], role: UserRole): boolean => {
    return user?.role === role;
};

// Helper function to check if user has any of the specified roles
export const hasAnyRole = (user: Express.Request['user'], roles: UserRole[]): boolean => {
    return user?.role ? roles.includes(user.role as UserRole) : false;
};