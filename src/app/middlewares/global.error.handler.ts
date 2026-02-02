import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.errors";
import { TErrorSources } from "../interface/error.type";
import { handlerDuplicateError } from "../helpers/handle.duplicate.error";
import { handleCastError } from "../helpers/handle.cast.error";
import { handlerZodError } from "../helpers/handle.zod.error";
import { handlerValidationError } from "../helpers/handle.validation.error";

export const globalErrorHandler = (
  e: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "something went wrong 🌏";

  // If it's a normal Error, extract the message early
  if (e instanceof Error) {
    message = e.message;
  }

  // Narrow shapes for property checks without using `any`
  const asWithCode = e as { code?: number; message?: string } | undefined;
  const asWithName = e as { name?: string } | undefined;
  const asDebug = e as { name?: string; message?: string; stack?: string } | undefined;

  // Duplicate error (Mongo duplicate key)
  if (asWithCode && asWithCode.code === 11000) {
    const simplifiedError = handlerDuplicateError({ message: asWithCode.message });
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Object ID error / Cast Error
  else if (asWithName && asWithName.name === "CastError") {
    const simplifiedError = handleCastError(e as mongoose.Error.CastError);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod validation error
  else if (asWithName && asWithName.name === "ZodError") {
    const simplifiedError = handlerZodError(e as { issues?: unknown });
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Mongoose Validation Error
  else if (asWithName && asWithName.name === "ValidationError") {
    const simplifiedError = handlerValidationError(e as mongoose.Error.ValidationError);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  }
  // Handle custom AppError
  else if (e instanceof AppError) {
    statusCode = e.statusCode;
    message = e.message;
  }
  // Handle standard Error (already handled above but keep for clarity)
  else if (e instanceof Error) {
    message = e.message;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errorSources && errorSources.length > 0 ? { errorSources } : {}),
    ...(process.env.NODE_ENV === "development" && {
      error: {
        name: asDebug?.name,
        message: asDebug?.message,
      },
      stack: asDebug?.stack?.split("\n").map((line: string) => line.trim()),
    }),
  });
};
