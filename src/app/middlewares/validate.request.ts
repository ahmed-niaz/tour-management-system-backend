import { NextFunction, Request, Response } from "express";
import z from "zod";

// middleware basic
const validateRequest = (schema: z.ZodSchema) => {
  const value = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };

  return value;
};

export default validateRequest;
