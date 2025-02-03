import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ApiError, StatusCodes } from "../utils";
import prisma from "../config/database";

export const checkRole = (requiredRole: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User not authenticated");
      }

      const userRole = await prisma.userRole.findUnique({
        where: { userId },
        select: { currentRole: true },
      });

      if (!userRole || userRole.currentRole !== requiredRole) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          `Access denied. ${requiredRole} role required.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
