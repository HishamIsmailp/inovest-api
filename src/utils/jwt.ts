import jwt from "jsonwebtoken";
import { ApiError, StatusCodes } from "./index";

interface TokenPayload {
  sub: string;
  role?: string;
  type: "access" | "refresh" | "reset";
  platform?: "ios" | "android" | "web";
}

export const generateTokens = (userId: string, role?: string) => {
  return {
    accessToken: jwt.sign(
      { sub: userId, role, type: "access" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    ),
    refreshToken: jwt.sign(
      { sub: userId, role, type: "refresh" },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    ),
  };
};

export const generateResetToken = (userId: string, platform: "ios" | "android" | "web") => {
  return jwt.sign(
    { 
      sub: userId, 
      type: "reset",
      platform 
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (
  token: string,
  type: "access" | "refresh" | "reset"
): TokenPayload => {
  try {
    const secret =
      type === "access" || type === "reset"
        ? process.env.JWT_SECRET!
        : process.env.JWT_REFRESH_SECRET!;

    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (decoded.type !== type) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        `Invalid token type. Expected ${type} token.`
      );
    }

    return decoded;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        `${type.charAt(0).toUpperCase() + type.slice(1)} token has expired`
      );
    }

    throw new ApiError(StatusCodes.UNAUTHORIZED, `Invalid ${type} token`);
  }
};
