import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { User } from '../../interfaces/userInterface';
import { UserService } from '../../services/v1/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getUsers();
    ApiResponse.success(res, 'Users retrieved successfully', users);
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getUserById(req.params.id);
    ApiResponse.success(res, 'User retrieved successfully', user);
  };

  
  // Add other controller methods...
} 