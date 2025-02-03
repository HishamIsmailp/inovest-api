import { prisma } from "../config";
import { ApiError, StatusCodes } from "../utils";
import { UpdateProfileDto, UpdateRoleDto } from "../types/common";
import { MessageType } from "@prisma/client";

export class CommonService {
  async updateProfile(userId: string, data: UpdateProfileDto) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
      },
    });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  }

  async updateRole(userId: string, data: UpdateRoleDto) {
    return prisma.userRole.update({
      where: { userId },
      data: { currentRole: data.role },
    });
  }

  async getChatMessages(chatId: string, userId: string) {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: {
            userId,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found");
    }

    return prisma.message.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async sendMessage(
    chatId: string,
    userId: string,
    content: string,
    messageType: MessageType
  ) {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: {
          some: {
            userId,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found");
    }

    return prisma.message.create({
      data: {
        chatId,
        senderId: userId,
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
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markNotificationRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}

export const commonService = new CommonService();
