import { User } from "./userInterface";

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
    userId: string;
    email: string;
}

export interface RefreshTokenPayload extends TokenPayload {
    tokenVersion: number;
}