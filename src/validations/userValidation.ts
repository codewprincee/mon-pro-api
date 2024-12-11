import { z } from 'zod';

export const userValidation = {
  getUserById: {
    params: z.object({
      id: z.string(),
    }),
  },
  createUser: {
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      // Add other validation rules
    }),
  },
  updateUser: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
    }),
  },
  deleteUser: {
    params: z.object({
      id: z.string(),
    }),
  },
}; 