import { UserRole } from "./role.interface";
import { User } from "./userInterface";
import { Request } from 'express';

export interface Auth {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface TokenPayload {
    planId: any;
    id(id: any, featureName: string): unknown;
    _id: string;
    email: string;
    role: UserRole;
}

export interface RefreshTokenPayload extends TokenPayload {
    tokenVersion: number;
}

export interface FeatureUsage {
    current: number;
    limit: number;
    remaining: number;
    featureName: string;
    isUnlimited: boolean;
}

// For use in request objects
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
    featureUsage?: FeatureUsage;
}