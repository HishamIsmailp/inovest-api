import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils";

export function validateRequest(schema: z.ZodType<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((issue: any) => `${issue.path.join(".")} is ${issue.message}`)
          .join(", ");
        const apiError = new ApiError(StatusCodes.BAD_REQUEST, errorMessages);
        return res.status(apiError.statusCode).json({
          success: false,
          message: apiError.message,
        });
      } else {
        const apiError = new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
        return res.status(apiError.statusCode).json({
          success: false,
          message: apiError.message,
        });
      }
    }
  };
}
