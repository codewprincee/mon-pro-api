import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

export const validateRequest = (schema: Record<string, Joi.Schema>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationSegments = ['params', 'query', 'body'] as const;

    try {
      for (const segment of validationSegments) {
        if (schema[segment]) {
          const { error } = schema[segment].validate(req[segment]);
          if (error) {
            throw new ApiError(400, error.details[0].message);
          }
        }
      }
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      next(error);
    }
  };
}; 