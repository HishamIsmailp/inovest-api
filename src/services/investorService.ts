import { prisma } from "../config";
import { ApiError, StatusCodes } from "../utils";
import { NotificationService } from "./notificationService";

export class InvestorService {
  async getCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });
  }

  async getTopIdeas(userId: string) {
    return prisma.project.findMany({
      where: { status: "AVAILABLE", entrepreneurId: { not: userId } },
      include: {
        category: true,
        entrepreneur: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            ratings: true,
            interests: true,
          },
        },
      },
      orderBy: {
        ratings: {
          _count: "desc",
        },
      },
      // take: 10,
    });
  }

  async getIdeas(userId: string) {
    return prisma.project.findMany({
      where: { status: "AVAILABLE", entrepreneurId: { not: userId } },
      include: {
        category: true,
        entrepreneur: {
          select: { id: true, name: true, imageUrl: true },
        },
        _count: {
          select: {
            ratings: true,
            interests: true,
          },
        }
      },
    });
  }

  async getCategoryIdeas(categoryId: string, userId: string) {
    return prisma.project.findMany({
      where: {
        categoryId,
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
        interests: {
          where: {
            investorId: userId,
          },
        },
      },
    });
  }

  async getIdeaDetail(ideaId: string) {
    const idea = await prisma.project.findUnique({
      where: { id: ideaId },
      include: {
        category: true,
        entrepreneur: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        ratings: {
          include: {
            investor: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        images: true,
      },
    });

    if (!idea) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Idea not found");
    }

    return idea;
  }

  async rateIdea(
    investorId: string,
    ideaId: string,
    rating: number,
    comment: string
  ) {
    return prisma.projectRating.upsert({
      where: {
        projectId_investorId: {
          projectId: ideaId,
          investorId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        projectId: ideaId,
        investorId,
        rating,
        comment,
      },
    });
  }

  async showInterest(investorId: string, ideaId: string) {
    const interest = await prisma.projectInterest.create({
      data: {
        projectId: ideaId,
        investorId,
        status: "INTERESTED",
      },
      include: {
        investor: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        project: {
          include: {
            entrepreneur: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (interest.project?.entrepreneur) {
      await NotificationService.sendNotification(
        interest.project.entrepreneur.id,
        "New Investment Interest",
        `${interest.investor.name} has shown interest in your project`,
        "INTEREST"
      );
    }

    return interest;
  }

  async getInterests(investorId: string) {
    return prisma.projectInterest.findMany({
      where: { investorId },
      include: {
        project: {
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
        },
      },
    });
  }
}

export const investorService = new InvestorService(); 