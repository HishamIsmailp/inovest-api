import { prisma } from "../config";
import { ApiError, StatusCodes } from "../utils";
import {
  CreateIdeaDto,
  UpdateIdeaDto
} from "../types/entrepreneur";
import { ProjectStatus, Prisma } from "@prisma/client";

export class EntrepreneurService {
  async createIdea(entrepreneurId: string, data: CreateIdeaDto) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    return prisma.project.create({
      data: {
        ...data,
        entrepreneurId,
        status: "AVAILABLE",
      },
      include: {
        category: true,
        entrepreneur: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async updateIdea(
    entrepreneurId: string,
    ideaId: string,
    data: UpdateIdeaDto
  ) {
    const project = await prisma.project.findFirst({
      where: {
        id: ideaId,
        entrepreneurId,
      },
    });

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
    }

    return prisma.project.update({
      where: { id: ideaId },
      data,
      include: {
        category: true,
        entrepreneur: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async deleteIdea(entrepreneurId: string, ideaId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: ideaId,
        entrepreneurId,
      },
    });

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
    }

    return prisma.$transaction([
      prisma.projectRating.deleteMany({ where: { projectId: ideaId } }),
      prisma.projectInterest.deleteMany({ where: { projectId: ideaId } }),
      prisma.projectImage.deleteMany({ where: { projectId: ideaId } }),
      prisma.payment.deleteMany({ where: { projectId: ideaId } }),
      prisma.message.deleteMany({
        where: {
          chat: {
            projectId: ideaId,
          },
        },
      }),
      prisma.chatParticipant.deleteMany({
        where: {
          chat: {
            projectId: ideaId,
          },
        },
      }),
      prisma.chat.deleteMany({ where: { projectId: ideaId } }),
      prisma.project.delete({ where: { id: ideaId } }),
    ]);
  }

  async listIdeas(entrepreneurId: string) {
    return prisma.project.findMany({
      where: { entrepreneurId },
      include: {
        category: true,
        _count: {
          select: {
            ratings: true,
            interests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(
    entrepreneurId: string,
    ideaId: string,
    status: ProjectStatus
  ) {
    const project = await prisma.project.findFirst({
      where: {
        id: ideaId,
        entrepreneurId,
      },
    });

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
    }

    const updateData: Prisma.ProjectUpdateInput = {
      status: status as ProjectStatus,
    };

    return prisma.project.update({
      where: { id: ideaId },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async getNotifications(entrepreneurId: string) {
    return prisma.notification.findMany({
      where: {
        userId: entrepreneurId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getChats(entrepreneurId: string) {
    return prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: entrepreneurId,
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
}

export const entrepreneurService = new EntrepreneurService();
