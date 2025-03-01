import { Request } from "express";
import { asyncHandler, ApiError, ApiResponse, StatusCodes } from "../utils";
import { authService } from "../services/authService";

export const authController = {
  signup: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    await authService.signup(req.body);

    return {
      status: StatusCodes.CREATED,
      message: "User created successfully",
    };
  }),

  login: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const result = await authService.login(req.body);

    return {
      status: StatusCodes.OK,
      data: result,
    };
  }),

  refreshToken: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Refresh token is required");
    }

    const result = await authService.refreshToken(refreshToken);

    return {
      status: StatusCodes.OK,
      data: result,
    };
  }),

  logout: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    return {
      status: StatusCodes.OK,
      message: "Logged out successfully",
    };
  }),

  forgotPassword: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    await authService.forgotPassword(req.body);

    return {
      status: StatusCodes.OK,
      message: "Password reset instructions sent to your email",
    };
  }),

  resetPassword: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    await authService.resetPassword(req.body);

    return {
      status: StatusCodes.OK,
      message: "Password reset successful",
    };
  }),
};
