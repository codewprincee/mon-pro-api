import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { UserService } from '../services/v1/UserService';
import httpStatus from 'http-status';
import { validateUserUpdate } from '../validators/userValidator';
import { User } from '../interfaces/userInterface';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
      ApiResponse.success(res, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      ApiResponse.success(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createdUser = await this.userService.createUser(userData);
      ApiResponse.success(res, 'User created successfully', createdUser);
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
      }
      const user = await this.userService.getUserById(req.user.id);
      ApiResponse.success(res, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  public updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
      }

      // Validate update data
      const validatedData = validateUserUpdate(req.body);
      
      const updatedUser = await this.userService.updateUser(req.user.id, validatedData);
      ApiResponse.success(res, 'Profile updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
      }
      await this.userService.deleteUser(req.user.id);
      ApiResponse.success(res, 'Profile deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate update data
      const validatedData = validateUserUpdate(req.body);
      
      const updatedUser = await this.userService.updateUser(req.params.id, validatedData);
      ApiResponse.success(res, 'User updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteUser(req.params.id);
      ApiResponse.success(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public changeRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role } = req.body;
      if (!role) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Role is required');
      }
      const updatedUser = await this.userService.updateUser(req.params.id, { role });
      ApiResponse.success(res, 'User role updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  };
}