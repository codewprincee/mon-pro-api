import { z } from 'zod';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(100).optional(),
  role: z.enum(['user', 'admin', 'manager']).optional(),
}).strict();

export const validateUserUpdate = (data: unknown) => {
  try {
    return userUpdateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalid user data: ' + error.errors.map(e => e.message).join(', ')
      );
    }
    throw error;
  }
};
