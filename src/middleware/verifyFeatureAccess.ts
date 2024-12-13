import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { ApiResponse } from '../utils/ApiResponse';
import { IPlanFeature, Plan } from '../models/Plan';
import { Usage } from '../models/Usage';
import mongoose from 'mongoose';

export const verifyFeatureAccess = (featureName: string, requiredLimit?: number) => {
    // Validate input parameters
    if (!featureName || typeof featureName !== 'string') {
        throw new Error('Feature name must be a non-empty string');
    }

    if (requiredLimit !== undefined && (!Number.isInteger(requiredLimit) || requiredLimit < 0)) {
        throw new Error('Required limit must be a non-negative integer');
    }

    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // Validate request and user
            if (!req.user?.id && !req.user?._id) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const userId = req.user.id || req.user._id;
            const { planId } = req.user;
            if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
                return ApiResponse.error(res, 'Invalid or missing subscription plan', 403);
            }

            // Get user's current plan with error handling
            let userPlan;
            try {
                userPlan = await Plan.findById(planId).lean();
            } catch (dbError) {
                console.error('Database error fetching plan:', dbError);
                return ApiResponse.error(res, 'Error fetching subscription plan', 500);
            }

            if (!userPlan) {
                return ApiResponse.error(res, 'Subscription plan not found', 404);
            }

            // Validate plan features array
            if (!Array.isArray(userPlan.features)) {
                console.error('Invalid plan structure: features is not an array');
                return ApiResponse.error(res, 'Invalid plan configuration', 500);
            }

            // Check if the feature exists in the plan
            const feature = userPlan.features.find(
                (f: IPlanFeature) => f.name === featureName
            );

            if (!feature) {
                return ApiResponse.error(
                    res,
                    `Feature "${featureName}" is not available in your current plan. Please upgrade to access this feature.`,
                    403
                );
            }

            // Validate feature structure
            if (typeof feature.isUnlimited !== 'boolean' ||
                (feature.limit !== undefined && typeof feature.limit !== 'number')) {
                console.error('Invalid feature configuration:', feature);
                return ApiResponse.error(res, 'Invalid feature configuration', 500);
            }

            // Check if feature has usage limits
            if (!feature.isUnlimited && typeof feature.limit === 'number') {
                try {
                    // Get current usage with error handling
                    let currentUsage;
                    try {
                        if (!req.user?.id && !req.user?._id) {
                            throw new Error('User ID is missing');
                        }
                        const userId = req.user.id || req.user._id;
                        currentUsage = await getUserFeatureUsage(userId.toString(), featureName);
                    } catch (usageError) {
                        console.error('Error fetching usage:', usageError);
                        return ApiResponse.error(res, 'Error fetching feature usage', 500);
                    }

                    // Validate current usage
                    if (typeof currentUsage !== 'number' || currentUsage < 0) {
                        console.error('Invalid usage value:', currentUsage);
                        return ApiResponse.error(res, 'Invalid usage data', 500);
                    }

                    // Check if required limit is specified and if usage would exceed limit
                    if (requiredLimit && (currentUsage + requiredLimit) > feature.limit) {
                        return ApiResponse.error(
                            res,
                            `Adding ${requiredLimit} would exceed your limit of ${feature.limit} for "${featureName}". Current usage: ${currentUsage}`,
                            403
                        );
                    }

                    // Check if any usage is possible
                    if (currentUsage >= feature.limit) {
                        return ApiResponse.error(
                            res,
                            `You've reached your usage limit of ${feature.limit} for "${featureName}". Please upgrade your plan for higher limits.`,
                            403
                        );
                    }

                    // Attach usage info to request for downstream middleware/routes
                    req.featureUsage = {
                        current: currentUsage,
                        limit: feature.limit,
                        remaining: feature.limit - currentUsage,
                        featureName,
                        isUnlimited: feature.isUnlimited
                    };

                } catch (usageError) {
                    console.error('Error checking feature usage:', usageError);
                    return ApiResponse.error(res, 'Failed to verify feature usage limits', 500);
                }
            }

            // If all checks pass, continue
            next();
        } catch (error) {
            console.error('Error in verifyFeatureAccess:', error);
            return ApiResponse.error(res, 'Internal server error while checking feature access', 500);
        }
    };
};

// Helper function to get current feature usage
async function getUserFeatureUsage(userId: string, featureName: string): Promise<number> {
    if (!userId || !featureName) {
        throw new Error('userId and featureName are required');
    }

    try {
        const usage = await Usage.findOne({ userId, featureName }).lean();
        return usage?.currentUsage ?? 0;
    } catch (error) {
        console.error('Error fetching usage:', error);
        throw error;
    }
}
