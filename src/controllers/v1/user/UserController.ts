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
    if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const { _id } = req.user;

    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
        return ApiResponse.error(res, 'User not found', 404);
    }

    return ApiResponse.success(res, 'Account deleted successfully', null);
});

const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response<UserResponse>) => {
    if (!req.user) {
        return ApiResponse.error(res, 'Unauthorized', 401);
    }

    const { _id } = req.user;

    // Ensure req.body is a valid update object
    if (!req.body || typeof req.body !== 'object') {
        return ApiResponse.error(res, 'Invalid update data', 400);
    }

    const updateData: Partial<IUser> = req.body as Partial<IUser>;

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        updateData,
        { new: true }
    ).select('-password -tokenVersion');

    if (!updatedUser) {
        return ApiResponse.error(res, 'User not found', 404);
    }

    return ApiResponse.success(res, 'User updated successfully', updatedUser);
});

export { getMe, deleteAccount };