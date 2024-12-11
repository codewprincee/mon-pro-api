import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import { ApiResponse } from '../../../utils/ApiResponse';
import { User } from '../../../models/User.model';
import { Auth, AuthResponse, TokenPayload, RefreshTokenPayload } from '../../../interfaces/auth.interface';

export class AuthController {
    private static ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
    private static REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    private static ACCESS_TOKEN_EXPIRY = '15m';
    private static REFRESH_TOKEN_EXPIRY = '7d';
    private static SALT_ROUNDS = 10;

    private createTokens(user: any): { accessToken: string; refreshToken: string } {
        const tokenPayload: TokenPayload = {
            userId: user._id,
            email: user.email
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
        return jwt.sign(payload, AuthController.ACCESS_TOKEN_SECRET, {
            expiresIn: AuthController.ACCESS_TOKEN_EXPIRY
        });
    }

    private createRefreshToken(payload: RefreshTokenPayload): string {
        return jwt.sign(payload, AuthController.REFRESH_TOKEN_SECRET, {
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

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
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
            { user: userResponse, accessToken, refreshToken },
            201
        );
    });

    public login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password }: Auth = req.body;

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
            { user: sanitizedUserResponse, accessToken, refreshToken }
        );
    });

    public refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token required');
        }

        try {
            const payload = jwt.verify(refreshToken, AuthController.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
            const user = await User.findById(payload.userId);

            if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
                throw new ApiError(401, 'Invalid refresh token');
            }

            const tokens = this.createTokens(user);
            return ApiResponse.success(res, 'Token refreshed successfully', tokens);
        } catch (error) {
            throw new ApiError(401, 'Invalid refresh token');
        }
    });
    public logout = asyncHandler(async (req: Request & { user?: { userId: string } }, res: Response) => {
        const userId = req.user?.userId;
        if (userId) {
            // Increment token version to invalidate all existing refresh tokens
            await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
        }
        return ApiResponse.success(res, 'Logged out successfully');
    });
}
