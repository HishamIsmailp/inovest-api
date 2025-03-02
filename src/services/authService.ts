import { prisma } from "../config";
import {
  ApiError,
  StatusCodes,
  hashPassword,
  comparePassword,
  generateTokens,
  generateAvatarUrl,
  generateResetToken,
} from "../utils";
import { verifyToken } from "../utils/jwt";
import { CreateUserDto, ForgotPasswordDto, LoginDto, ResetPasswordDto } from "../types/auth";
import { resetPasswordTemplate } from "../utils/emailTemplates";
import { NotificationService } from "./notificationService";
import { appConfig } from "../config/app.config";
import { welcomeTemplate } from "../templates/emails/welcome";

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

      await NotificationService.sendEmail(user.email, "Welcome to Inovest", welcomeTemplate(user.name));

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

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const resetToken = generateResetToken(user.id, data.platform);

    let resetLink: string;
    switch (data.platform) {
      case "ios":
        resetLink = `inovest://reset-password?token=${resetToken}`;
        break;
      case "android":
        resetLink = `https://inovest-api-ezgy.vercel.app/reset-password?token=${resetToken}`;
        break;
      case "web":
        resetLink = `${data.clientUrl || appConfig.clientUrl}/reset-password?token=${resetToken}`;
        break;
    }
    
    await NotificationService.sendEmail(
      user.email,
      "Reset Your Password",
      resetPasswordTemplate(resetLink)
    );

    return true;
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const decoded = verifyToken(data.token, "reset");

      const hashedPassword = await hashPassword(data.password);
      
      await prisma.user.update({
        where: { id: decoded.sub },
        data: { passwordHash: hashedPassword },
      });

      return true;
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired token");
    }
  }
}

export const authService = new AuthService();
