import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { prisma } from "../config";
import {
  hashPassword,
  comparePassword,
  generateTokens,
  asyncHandler,
  ApiError,
  ApiResponse,
  StatusCodes,
  generateAvatarUrl,
} from "../utils";

export const authController = {
  signup: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    const hashedPassword = await hashPassword(password);

    const avatarUrl = generateAvatarUrl(name);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          imageUrl: avatarUrl,
          passwordHash: hashedPassword,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          currentRole: role,
        },
      });
    });

    return {
      status: StatusCodes.CREATED,
      message: "User created successfully",
    };
  }),

  login: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.passwordHash) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const tokens = generateTokens(user.id);

    return {
      status: StatusCodes.OK,
      data: {
        ...tokens,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          role: user.role?.currentRole,
        },
      },
    };
  }),

  refreshToken: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { refreshToken } = req.body;

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub as string },
        include: { role: true },
      });

      if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
      }

      const tokens = generateTokens(user.id);

      return {
        status: StatusCodes.OK,
        data: { ...tokens },
      };
    } catch (error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
  }),
};
