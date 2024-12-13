export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    PREMIUM = 'premium'
}

export const isValidRole = (role: string): role is UserRole => {
    return Object.values(UserRole).includes(role as UserRole);
};
