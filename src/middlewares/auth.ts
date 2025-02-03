import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError, StatusCodes } from "../utils";
import prisma from "../config/database";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Invalid authorization header"
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token, "access");

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { role: true },
    });

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    req.user = {
      id: user.id,
      role: user.role?.currentRole,
    };

    next();
  } catch (error) {
    next(error);
  }
};
