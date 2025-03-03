import { Request } from "express";
import { asyncHandler, ApiResponse, ApiError, StatusCodes } from "../utils";
import { prisma } from "../config";
import { commonService } from "../services/commonService";
import { NotificationService } from "../services/notificationService";

export const commonController = {
  updateProfile: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const updatedUser = await commonService.updateProfile(
      req.user!.id,
      req.body
    );

    return {
      status: StatusCodes.OK,
      data: updatedUser,
      message: "Profile updated successfully",
    };
  }),

  getProfile: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const user = await commonService.getProfile(req.user!.id);

    return {
      status: StatusCodes.OK,
      data: user,
    };
  }),

  updateRole: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const updatedRole = await commonService.updateRole(req.user!.id, req.body);

    return {
      status: StatusCodes.OK,
      data: updatedRole,
      message: "Role updated successfully",
    };
  }),

  getChatMessages: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const messages = await commonService.getChatMessages(
      req.params.id,
      req.user!.id
    );

    return {
      status: StatusCodes.OK,
      data: messages,
    };
  }),

  sendMessage: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const message = await commonService.sendMessage(
      req.params.id,
      req.user!.id,
      req.body.content,
      req.body.messageType
    );

    return {
      status: StatusCodes.CREATED,
      data: message,
      message: "Message sent successfully",
    };
  }),

  getNotifications: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const notifications = await commonService.getNotifications(req.user!.id);

    return {
      status: StatusCodes.OK,
      data: notifications,
    };
  }),

  markNotificationRead: asyncHandler(
    async (req: Request): Promise<ApiResponse> => {
      const notification = await commonService.markNotificationRead(
        req.params.id,
        req.user!.id
      );

      return {
        status: StatusCodes.OK,
        data: notification,
        message: "Notification marked as read",
      };
    }
  ),

  createPayment: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { projectId, amount } = req.body;
    const investorId = req.user!.id;

    const payment = await prisma.payment.create({
      data: {
        projectId,
        investorId,
        amount,
        status: "PENDING",
      },
    });

    return {
      status: StatusCodes.CREATED,
      data: payment,
      message: "Payment created successfully",
    };
  }),

  verifyPayment: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { paymentId, transactionId } = req.body;

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
      },
      include: {
        project: true,
      },
    });

    await prisma.project.update({
      where: { id: payment.projectId },
      data: {
        status: "INVESTED",
      },
    });

    return {
      status: StatusCodes.OK,
      data: payment,
      message: "Payment verified successfully",
    };
  }),

  updateFcmToken: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { token } = req.body;
    
    await NotificationService.updateFcmToken(req.user!.id, token);

    return {
      status: StatusCodes.OK,
      message: "FCM token updated successfully",
    };
  }),

  getChats: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const chats = await commonService.getChats(req.user!.id);

    return {
      status: StatusCodes.OK,
      data: chats,
    };
  }),

  initializeChat: asyncHandler(async (req: Request): Promise<ApiResponse> => {
      const entrepreneurId = req.user!.id;
      const { investorId, projectId } = req.params;
      
      const result = await commonService.initializeChat(entrepreneurId, investorId, projectId);
      
      return {
        status: StatusCodes.OK,
        data: result,
        message: 'Chat initialized successfully'
    };
  }),
};
