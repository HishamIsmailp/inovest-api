import { Request } from "express";
import { asyncHandler, ApiResponse, ApiError, StatusCodes } from "../utils";
import { prisma } from "../config";

export const commonController = {
  updateProfile: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const userId = req.user!.id;
    const { name, imageUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
      },
    });

    return {
      status: StatusCodes.OK,
      data: updatedUser,
      message: "Profile updated successfully",
    };
  }),

  getProfile: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return {
      status: StatusCodes.OK,
      data: user,
    };
  }),

  updateRole: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const userId = req.user!.id;
    const { role } = req.body;

    const updatedRole = await prisma.userRole.update({
      where: { userId },
      data: { currentRole: role },
    });

    return {
      status: StatusCodes.OK,
      data: updatedRole,
      message: "Role updated successfully",
    };
  }),

  getChatMessages: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const userId = req.user!.id;

    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatId_userId: {
          chatId: id,
          userId,
        },
      },
    });

    if (!participant) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Not authorized to access this chat"
      );
    }

    const messages = await prisma.message.findMany({
      where: { chatId: id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      status: StatusCodes.OK,
      data: messages,
    };
  }),

  sendMessage: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const { content, messageType } = req.body;
    const senderId = req.user!.id;

    const message = await prisma.message.create({
      data: {
        chatId: id,
        senderId,
        content,
        messageType,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    req.app.get("socketService").sendMessage(id, message);

    return {
      status: StatusCodes.OK,
      data: message,
      message: "Message sent successfully",
    };
  }),

  getNotifications: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      status: StatusCodes.OK,
      data: notifications,
    };
  }),

  markNotificationRead: asyncHandler(
    async (req: Request): Promise<ApiResponse> => {
      const { id } = req.params;
      const userId = req.user!.id;

      const notification = await prisma.notification.update({
        where: {
          id,
          userId,
        },
        data: {
          read: true,
        },
      });

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
};
