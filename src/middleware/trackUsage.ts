import { Request, Response, NextFunction } from 'express';

// Middleware to track usage of routes
export const trackUsage = (featureName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user ? req.user._id : 'anonymous';
        console.log(`User ${userId} accessed feature: ${featureName} at ${new Date().toISOString()}`);
        // Here you could also save this information to a database or analytics service
        next();
    };
};