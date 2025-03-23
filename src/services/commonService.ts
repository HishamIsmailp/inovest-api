import { prisma } from "../config";
import { ApiError, StatusCodes } from "../utils";
import { UpdateProfileDto, UpdateRoleDto } from "../types/common";
import { MessageType } from "@prisma/client";
import { SocketService } from "./socketService";
import { NotificationService } from "./notificationService";

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
      orderBy: { createdAt: "desc" },
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
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found");
    }

    const message = await prisma.message.create({
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

    const otherParticipants = chat.participants
      .filter((p) => p.userId !== userId)
      .map((p) => p.user);

    for (const participant of otherParticipants) {
      await NotificationService.sendNotification(
        participant.id,
        "New Message",
        content,
        "MESSAGE"
      );
    }

    SocketService.emitNewMessage(chatId, message);

    return message;
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

  async getChats(userId: string) {
    return prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: [
        {
          messages: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async initializeChat(
    entrepreneurId: string,
    investorId: string,
    projectId: string
  ): Promise<{ chatId: string }> {
    return prisma.$transaction(async (tx) => {
      const existingChat = await tx.chat.findFirst({
        where: {
          projectId,
          AND: [
            {
              participants: {
                some: {
                  userId: entrepreneurId,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: investorId,
                },
              },
            },
          ],
        },
      });

      if (existingChat) {
        return {
          chatId: existingChat.id,
        };
      }

      const newChat = await tx.chat.create({
        data: {
          project: {
            connect: { id: projectId },
          },
        },
      });

      await tx.chatParticipant.createMany({
        data: [
          {
            chatId: newChat.id,
            userId: entrepreneurId,
          },
          {
            chatId: newChat.id,
            userId: investorId,
          },
        ],
        skipDuplicates: true,
      });

      await tx.message.create({
        data: {
          chatId: newChat.id,
          senderId: entrepreneurId,
          content:
            "Hi, I'm interested in discussing potential investment opportunities.",
          messageType: "TEXT",
        },
      });

      return {
        chatId: newChat.id,
      };
    });
  }
}

export const commonService = new CommonService();
