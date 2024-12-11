import { Response } from 'express';

export class ApiResponse {
  static error(res: Response<any, Record<string, any>>, message: string, statusCode: number): void | Promise<void> {
      throw new Error('Method not implemented.');
  }
  static success(
    res: Response,
    message: string = 'Success',
    data: any = null,
    statusCode: number = 200
  ) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
} 