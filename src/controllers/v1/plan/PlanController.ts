import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/ApiResponse';
import { Plan, IPlan } from '../../../models/Plan';
import { Usage } from '../../../models/Usage';
import { AuthenticatedRequest } from '../../../interfaces/auth.interface';
import mongoose from 'mongoose';
import { ApiError } from '../../../utils/ApiError';

// Get all active plans
export const getPlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = await Plan.find({ isActive: true });
    return ApiResponse.success(res, 'Plans retrieved successfully', plans);
});

// Create a new plan (admin only)
export const createPlan = asyncHandler(async (req: Request, res: Response) => {
    const plan = await Plan.create(req.body);
    return ApiResponse.success(res, "Plan created successfully", plan);
});

// Update plan (admin only)
export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndUpdate(id, req.body, { new: true });
    if (!plan) {
        return ApiResponse.error(res, 'Plan not found', 404);
    }
    return ApiResponse.success(res, "Plan updated successfully", plan);
});

// Get user's current usage
export const getUserUsage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const usage = await Usage.find({
        userId: req.user?._id,
        billingCycleEnd: { $gte: new Date() }
    }).populate('planId');
    return ApiResponse.success(res, "Usage retrieved successfully", usage);
});

interface IncrementUsageRequest {
    featureName: string;
}

// Increment feature usage
export const incrementUsage = asyncHandler(async (req: AuthenticatedRequest & { body: IncrementUsageRequest }, res: Response) => {
    const { featureName } = req.body;
    const userId = req.user?._id;

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            // Get user's current plan and usage
            const usage = await Usage.findOne({
                userId,
                featureName,
                billingCycleEnd: { $gte: new Date() }
            }).populate('planId');

            if (!usage) {
                throw new Error('No active usage record found');
            }

            const plan = usage.planId as unknown as IPlan;
            const feature = plan.features.find(f => f.name === featureName);

            if (!feature) {
                throw new Error('Feature not found in plan');
            }

            // Check if user has hit their limit
            if (!feature.isUnlimited && usage.currentUsage >= (feature.limit || 0)) {
                throw new Error('Usage limit exceeded');
            }

            // Increment usage
            usage.currentUsage += 1;
            usage.lastUpdated = new Date();
            await usage.save();

            return ApiResponse.success(res, "Usage incremented successfully", usage);
        });
    } catch (error) {
        return ApiResponse.error(res, (error as ApiError).message, (error as ApiError).statusCode);
    } finally {
        session.endSession();
    }
});
