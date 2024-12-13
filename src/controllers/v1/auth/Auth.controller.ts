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
        if (!AuthController.ACCESS_TOKEN_SECRET || !AuthController.REFRESH_TOKEN_SECRET) {
            throw new ApiError(500, 'JWT secrets not configured');
        }
    }

    private createTokens(user: any): { accessToken: string; refreshToken: string } {
        this.validateJwtSecrets();

        const tokenPayload: TokenPayload = {
            _id: user._id.toString(),
            email: user.email,
            role: user.role || UserRole.USER,
            planId: user.planId,
            id: user._id.toString()
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

        if (!email || !password || !firstName || !lastName) {
            throw new ApiError(400, 'All fields are required');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, 'Email already registered');
        }

        const hashedPassword = await hash(password, AuthController.SALT_ROUNDS);

        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: UserRole.USER,
            tokenVersion: 0,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });

        const { accessToken, refreshToken } = this.createTokens(user);

        const { password: _, tokenVersion: __, ...sanitizedUserResponse } = user.toObject();

        return ApiResponse.success(
            res,
            'Registration successful',
            { user: sanitizedUserResponse, accessToken, refreshToken },
            201
        );
    });

    public login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password }: Auth = req.body;

        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            throw new ApiError(401, 'Invalid credentials');
        }

        user.lastLoginAt = new Date();
        await user.save();

        const { accessToken, refreshToken } = this.createTokens(user);

        const { password: _, tokenVersion: __, ...sanitizedUserResponse } = user.toObject();

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
        const { refreshToken } = req.body;
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
            await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
        }
        return ApiResponse.success(res, 'Logged out successfully');
    });
}
