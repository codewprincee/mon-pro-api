import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import { ApiResponse } from '../../../utils/ApiResponse';
import { UserRole } from '../../../interfaces/role.interface';

import { Auth, AuthResponse, TokenPayload, RefreshTokenPayload } from '../../../interfaces/auth.interface';
import { User } from '../../../models/User';

export class AuthController {
    private static ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "my_secret";
    private static REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "my_secret";
    private static ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
    private static REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
    private static SALT_ROUNDS = 10;

    private validateJwtSecrets() {
        if (!AuthController.ACCESS_TOKEN_SECRET) {
            throw new ApiError(500, 'JWT access secret not configured');
        }
        if (!AuthController.REFRESH_TOKEN_SECRET) {
            throw new ApiError(500, 'JWT refresh secret not configured');
        }
    }

    private createTokens(user: any): { accessToken: string; refreshToken: string } {
        this.validateJwtSecrets();
        console.log("MY Access", AuthController.ACCESS_TOKEN_SECRET);
        console.log("MY Refresh", AuthController.REFRESH_TOKEN_SECRET);
        
        
        const tokenPayload: TokenPayload = {
            _id: user._id.toString(), // Ensure _id is a string
            email: user.email,
            role: user.role || UserRole.USER
        };

        const refreshPayload: RefreshTokenPayload = {
            ...tokenPayload,
            tokenVersion: user.tokenVersion || 0
        };

        return {
            accessToken: this.createAccessToken(tokenPayload),
            refreshToken: this.createRefreshToken(refreshPayload)
        };
    }

    private createAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, AuthController.ACCESS_TOKEN_SECRET!, {
            expiresIn: AuthController.ACCESS_TOKEN_EXPIRY
        });
    }

    private createRefreshToken(payload: RefreshTokenPayload): string {
        return jwt.sign(payload, AuthController.REFRESH_TOKEN_SECRET!, {
            expiresIn: AuthController.REFRESH_TOKEN_EXPIRY
        });
    }

    public register = asyncHandler(async (req: Request, res: Response) => {
        const { email, password, firstName, lastName } = req.body;

        // Check if all required fields are present
        if (!email) {
            throw new ApiError(400, 'Email is required');
        }
        if (!password) {
            throw new ApiError(400, 'Password is required');
        }
        if (!firstName) {
            throw new ApiError(400, 'First name is required');
        }
        if (!lastName) {
            throw new ApiError(400, 'Last name is required');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, 'Email already registered');
        }

        // Hash password
        const hashedPassword = await hash(password, AuthController.SALT_ROUNDS);

        // Create user with default role
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: UserRole.USER,
            tokenVersion: 0,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
        });

        const { accessToken, refreshToken } = this.createTokens(user);

        // Remove sensitive data
        const userResponse = user.toObject();
        const { password: _, tokenVersion: __, ...sanitizedUserResponse } = userResponse;

        return ApiResponse.success(
            res,
            'Registration successful',
            { user: sanitizedUserResponse, accessToken, refreshToken },
            201
        );
    });

    public login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password }: Auth = req.body;

        if (!email) {
            throw new ApiError(400, 'Email is required');
        }
        if (!password) {
            throw new ApiError(400, 'Password is required');
        }

        // Find user and select password
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Verify password
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        const { accessToken, refreshToken } = this.createTokens(user);

        // Remove sensitive data
        const userResponse = user.toObject();
        const { password: _, tokenVersion: __, ...sanitizedUserResponse } = userResponse;

        return ApiResponse.success(
            res,
            'Login successful',
            { 
                user: sanitizedUserResponse,
                accessToken,
                refreshToken
            }
        );
    });

    public refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token required');
        }

        try {
            const payload = jwt.verify(refreshToken, AuthController.REFRESH_TOKEN_SECRET!) as RefreshTokenPayload;
            const user = await User.findById(payload._id);

            if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
                throw new ApiError(401, 'Invalid refresh token');
            }

            const tokens = this.createTokens(user);
            return ApiResponse.success(res, 'Token refreshed successfully', tokens);
        } catch (error) {
            throw new ApiError(401, 'Invalid refresh token');
        }
    });

    public logout = asyncHandler(async (req: Request & { user?: { _id: string } }, res: Response) => {
        const userId = req.user?._id;
        if (userId) {
            // Increment token version to invalidate all existing refresh tokens
            await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
        }
        return ApiResponse.success(res, 'Logged out successfully');
    });
}
