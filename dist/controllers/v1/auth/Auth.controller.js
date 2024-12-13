"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../../../utils/asyncHandler");
const ApiError_1 = require("../../../utils/ApiError");
const ApiResponse_1 = require("../../../utils/ApiResponse");
const role_interface_1 = require("../../../interfaces/role.interface");
const User_1 = require("../../../models/User");
class AuthController {
    constructor() {
        this.register = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, lastName } = req.body;
            if (!email || !password || !firstName || !lastName) {
                throw new ApiError_1.ApiError(400, 'All fields are required');
            }
            const existingUser = yield User_1.User.findOne({ email });
            if (existingUser) {
                throw new ApiError_1.ApiError(409, 'Email already registered');
            }
            const hashedPassword = yield (0, bcrypt_1.hash)(password, AuthController.SALT_ROUNDS);
            const user = yield User_1.User.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: role_interface_1.UserRole.USER,
                tokenVersion: 0,
                trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            });
            const { accessToken, refreshToken } = this.createTokens(user);
            const _a = user.toObject(), { password: _, tokenVersion: __ } = _a, sanitizedUserResponse = __rest(_a, ["password", "tokenVersion"]);
            return ApiResponse_1.ApiResponse.success(res, 'Registration successful', { user: sanitizedUserResponse, accessToken, refreshToken }, 201);
        }));
        this.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new ApiError_1.ApiError(400, 'Email and password are required');
            }
            const user = yield User_1.User.findOne({ email }).select('+password');
            if (!user || !user.isActive) {
                throw new ApiError_1.ApiError(401, 'Invalid credentials');
            }
            const isValidPassword = yield (0, bcrypt_1.compare)(password, user.password);
            if (!isValidPassword) {
                throw new ApiError_1.ApiError(401, 'Invalid credentials');
            }
            user.lastLoginAt = new Date();
            yield user.save();
            const { accessToken, refreshToken } = this.createTokens(user);
            const _a = user.toObject(), { password: _, tokenVersion: __ } = _a, sanitizedUserResponse = __rest(_a, ["password", "tokenVersion"]);
            return ApiResponse_1.ApiResponse.success(res, 'Login successful', {
                user: sanitizedUserResponse,
                accessToken,
                refreshToken
            });
        }));
        this.refreshToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new ApiError_1.ApiError(401, 'Refresh token required');
            }
            try {
                const payload = jsonwebtoken_1.default.verify(refreshToken, AuthController.REFRESH_TOKEN_SECRET);
                const user = yield User_1.User.findById(payload._id);
                if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
                    throw new ApiError_1.ApiError(401, 'Invalid refresh token');
                }
                const tokens = this.createTokens(user);
                return ApiResponse_1.ApiResponse.success(res, 'Token refreshed successfully', tokens);
            }
            catch (error) {
                throw new ApiError_1.ApiError(401, 'Invalid refresh token');
            }
        }));
        this.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (userId) {
                yield User_1.User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
            }
            return ApiResponse_1.ApiResponse.success(res, 'Logged out successfully');
        }));
    }
    validateJwtSecrets() {
        if (!AuthController.ACCESS_TOKEN_SECRET || !AuthController.REFRESH_TOKEN_SECRET) {
            throw new ApiError_1.ApiError(500, 'JWT secrets not configured');
        }
    }
    createTokens(user) {
        this.validateJwtSecrets();
        const tokenPayload = {
            _id: user._id.toString(),
            email: user.email,
            role: user.role || role_interface_1.UserRole.USER,
            planId: user.planId,
            id: user._id.toString()
        };
        const refreshPayload = Object.assign(Object.assign({}, tokenPayload), { tokenVersion: user.tokenVersion || 0 });
        return {
            accessToken: this.createAccessToken(tokenPayload),
            refreshToken: this.createRefreshToken(refreshPayload)
        };
    }
    createAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, AuthController.ACCESS_TOKEN_SECRET, {
            expiresIn: AuthController.ACCESS_TOKEN_EXPIRY
        });
    }
    createRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, AuthController.REFRESH_TOKEN_SECRET, {
            expiresIn: AuthController.REFRESH_TOKEN_EXPIRY
        });
    }
}
exports.AuthController = AuthController;
AuthController.ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "my_secret";
AuthController.REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "my_secret";
AuthController.ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
AuthController.REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
AuthController.SALT_ROUNDS = 10;
