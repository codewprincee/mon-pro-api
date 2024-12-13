import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';
import { UserRole, isValidRole } from '../interfaces/role.interface';
import { extractTokenFromHeader } from '../utils/token';

interface JwtPayload {
    _id: string;
    email: string;
    role: UserRole;
    planId: string;
    id: string;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token using utility function
        const token = extractTokenFromHeader(req);

        const accessSecret = process.env.JWT_ACCESS_SECRET || 'my_secret';

        console.log("Access Secret", accessSecret);
        

        try {
            const decoded = jwt.verify(token, accessSecret) as JwtPayload;
            
            // Verify token hasn't expired
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired');
            }

            // Validate required fields
            if (!decoded._id || !decoded.email) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token payload');
            }

            // Validate role
            if (!decoded.role || !isValidRole(decoded.role)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid user role');
            }

            req.user = {
                _id: decoded._id,
                email: decoded.email,
                role: decoded.role,
                planId: decoded._id, // Using _id as planId for now
                id: decoded._id,    // Using _id as id for now
                iat: decoded.iat,
                exp: decoded.exp
            };

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
            } else if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
        }
    } catch (error) {
        next(error);
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
            }

            if (!roles.includes(req.user.role)) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    'You do not have permission to perform this action'
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
