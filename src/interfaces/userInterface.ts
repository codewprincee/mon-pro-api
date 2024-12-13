export interface User {
    id?: string;
    name: string;
    email: string;
    role?: string;
    planId?: string;
    subscriptionStatus?: 'active' | 'inactive' | 'expired';
    subscriptionEndDate?: Date;
    // Add other user properties as needed
}
