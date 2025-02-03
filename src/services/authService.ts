import { prisma } from "../config";
import {
  ApiError,
  StatusCodes,
  hashPassword,
  comparePassword,
  generateTokens,
  generateAvatarUrl,
} from "../utils";
import { verifyToken } from "../utils/jwt";
import { CreateUserDto, LoginDto } from "../types/auth";

export class AuthService {
  async signup(data: CreateUserDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);
    const avatarUrl = generateAvatarUrl(data.name);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          imageUrl: avatarUrl,
          passwordHash: hashedPassword,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          currentRole: data.role,
        },
      });

      return user;
    });
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true },
    });

    if (!user || !user.passwordHash) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const validPassword = await comparePassword(
      data.password,
      user.passwordHash
    );
    if (!validPassword) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const tokens = generateTokens(user.id, user.role?.currentRole);

    return {
      tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role?.currentRole,
      },
    };
  }

  async refreshToken(token: string) {
    const decoded = verifyToken(token, "refresh");

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { role: true },
    });

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    return generateTokens(user.id, user.role?.currentRole);
  }
}

export const authService = new AuthService();
