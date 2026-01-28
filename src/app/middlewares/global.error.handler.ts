import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.errors";

export const globalErrorHandler = (
  e: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
 let statusCode = 500;
 let message = e.message || "something went wrong 🌏";

  // Handle custom AppError
  if (e instanceof AppError) {
    statusCode = e.statusCode;
    message = e.message;
  }
  // Handle standard Error
  else if (e instanceof Error) {
    message = e.message;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      error: {
        name: e.name,
        message: e.message,
      },
      stack: e.stack?.split("\n").map((line) => line.trim()),
    }),
  });
};