import { Request, Response, NextFunction } from "express";
import logger from "./logger";

export interface ApiResponse {
  status: number;
  data?: any;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<ApiResponse>;

export const asyncHandler = (handler: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);
      res.status(result.status).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Request error:", {
          error: error.message,
          stack: error.stack,
          path: req.path,
          method: req.method,
        });

        if (error instanceof ApiError) {
          return res.status(error.statusCode).json({
            success: false,
            message: error.message,
          });
        }
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};
