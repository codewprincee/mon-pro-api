import { UserRole } from "./role.interface";
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
    _id: string;
    email: string;
    role: UserRole;
}

export interface RefreshTokenPayload extends TokenPayload {
    tokenVersion: number;
}

// For use in request objects
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}