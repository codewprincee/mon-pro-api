import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Plan } from '../../../models/Plan';
import { User } from '../../../models/User';
import { Usage } from '../../../models/Usage';
import { planSeeds } from '../../../seeds/plans.seed';
import { userSeeds } from '../../../seeds/users.seed';
import { usageSeeds } from '../../../seeds/usage.seed';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiResponse } from '../../../utils/ApiResponse';
import { ApiError } from '../../../utils/ApiError';

export class SeedController {
    public seedDatabase = asyncHandler(async (_req: Request, res: Response) => {
        let connection;
        try {
            // Connect to MongoDB
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/montpro';
            connection = await mongoose.connect(mongoUri);
            console.log('Connected to MongoDB for seeding');

            // delete existing data
            await Promise.all([
                Plan.deleteMany({}),
                User.deleteMany({}),
                Usage.deleteMany({})
            ]);
            console.log('Cleared existing data');

            // First seed plans as users depend on them
            const plans = await Plan.insertMany(planSeeds, { ordered: false });
            console.log('Seeded plans:', plans.length);

            // Then seed users
            const users = await User.insertMany(userSeeds);
            console.log('Seeded users:', users.length);

            // Finally seed usage data
            const usages = await Usage.insertMany(usageSeeds, { ordered: false });
            console.log('Seeded usage data:', usages.length);

            return ApiResponse.success(
                res,
                'Database seeded successfully',
                {
                    seededCounts: {
                        plans: plans.length,
                        users: users.length,
                        usages: usages.length
                    }
                },
                201
            );
        } catch (error) {
            console.error('Error seeding database:', error);
            throw new ApiError(500, `Error seeding database: ${(error as Error).message}`);
        }
    });
}
