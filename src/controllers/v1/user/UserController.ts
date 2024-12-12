import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { User, IUser } from '../../../models/User';
import { AuthenticatedRequest } from '../../../interfaces/auth.interface';
import { ApiResponse } from '../../../utils/ApiResponse';

interface UserResponse {
    success: boolean;
    data?: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        fullName: string;
        isActive: boolean;
        accountStatus: string;
        subscription: {
            trialStatus: string;
            trialEndsAt: Date;
        };
        [key: string]: any;
    };
    message?: string;
}

const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response<UserResponse>) => {
    const user = await User.findById(req.user?._id)
        .select('-password -tokenVersion')
        .lean();

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        data: {
            ...user,
            _id: user._id.toString(),
            fullName: `${user.firstName} ${user.lastName}`,
            accountStatus: user.isActive ? 'Active' : 'Inactive',
            subscription: {
                trialStatus: new Date(user.trialEndsAt) > new Date() ? 'Active' : 'Expired',
                trialEndsAt: user.trialEndsAt
            }
        }
    });
});

const deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response<UserResponse>) => {
    const { _id } = req.user;
    await User.findByIdAndDelete(_id);

    return ApiResponse.success(res, 'Account deleted successfully');
});

export { getMe, deleteAccount };