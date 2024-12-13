import { asyncHandler } from "../../../utils/asyncHandler";
import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { AuthenticatedRequest } from '../../../interfaces/auth.interface';

import { ApiError } from '../../../utils/ApiError';
import { Monitor } from "../../../models/Monitor";

export class MonitorController {
    public createMonitor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { name, url, checkInterval, methodType } = req.body;
        const userId = req.user?._id;

        const monitor = await Monitor.create({ name, url, checkInterval, methodType, userId });
        return ApiResponse.success(res, 'Monitor created successfully', monitor, 201);
    });

    public getMonitors = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?._id;
        const monitors = await Monitor.find({ userId });
        return ApiResponse.success(res, 'Monitors retrieved successfully', monitors);
    });

    public updateMonitor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const update = req.body;
        const userId = req.user?._id;

        const monitor = await Monitor.findOneAndUpdate({ _id: id, userId }, update, { new: true });
        if (!monitor) {
            throw new ApiError(404, 'Monitor not found');
        }
        return ApiResponse.success(res, 'Monitor updated successfully', monitor);
    });

    public deleteMonitor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const userId = req.user?._id;

        const monitor = await Monitor.findOneAndDelete({ _id: id, userId });
        if (!monitor) {
            throw new ApiError(404, 'Monitor not found');
        }
        return ApiResponse.success(res, 'Monitor deleted successfully', null);
    });

    public suspendMonitoring = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const userId = req.user?._id;

        const monitor = await Monitor.findOneAndUpdate(
            { _id: id, userId },
            { isActive: false },
            { new: true }
        );
        if (!monitor) {
            throw new ApiError(404, 'Monitor not found');
        }
        return ApiResponse.success(res, 'Monitoring suspended successfully', monitor);
    });

    public resumeMonitoring = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const userId = req.user?._id;

        const monitor = await Monitor.findOneAndUpdate(
            { _id: id, userId },
            { isActive: true },
            { new: true }
        );
        if (!monitor) {
            throw new ApiError(404, 'Monitor not found');
        }
        return ApiResponse.success(res, 'Monitoring resumed successfully', monitor);
    });


    public getMonitorsStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?._id;
        const monitors = await Monitor.find({ userId });
        return ApiResponse.success(res, 'Monitor status retrieved successfully', monitors);
    });
}