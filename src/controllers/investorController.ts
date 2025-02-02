import { Request } from "express";
import { prisma } from "../config";
import { ApiError, ApiResponse, asyncHandler, StatusCodes } from "../utils";

export const investorController = {
  getCategories: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    return {
      status: StatusCodes.OK,
      data: categories,
    };
  }),

  getTopIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const topIdeas = await prisma.project.findMany({
      where: { status: "AVAILABLE" },
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
      take: 10,
    });

    return {
      status: StatusCodes.OK,
      data: topIdeas,
    };
  }),

  getCategoryIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const ideas = await prisma.project.findMany({
      where: {
        categoryId: id,
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

    return {
      status: StatusCodes.OK,
      data: ideas,
    };
  }),

  getIdeaDetail: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const idea = await prisma.project.findUnique({
      where: { id },
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

    return {
      status: StatusCodes.OK,
      data: idea,
    };
  }),

  rateIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const investorId = req.user!.id;

    const updatedRating = await prisma.projectRating.upsert({
      where: {
        projectId_investorId: {
          projectId: id,
          investorId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        projectId: id,
        investorId,
        rating,
        comment,
      },
    });

    return {
      status: StatusCodes.OK,
      data: updatedRating,
      message: "Rating updated successfully",
    };
  }),

  showInterest: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const investorId = req.user!.id;

    const interest = await prisma.projectInterest.create({
      data: {
        projectId: id,
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
      },
    });

    const project = await prisma.project.findUnique({
      where: { id },
      select: { entrepreneurId: true },
    });

    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.entrepreneurId,
          type: "INTEREST",
          title: "New Interest",
          message: `An investor has shown interest in your project`,
        },
      });
    }

    return {
      status: StatusCodes.CREATED,
      data: interest,
      message: "Interest shown successfully",
    };
  }),

  getInterests: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const investorId = req.user!.id;
    const interests = await prisma.projectInterest.findMany({
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

    return {
      status: StatusCodes.OK,
      data: interests,
    };
  }),

  getChats: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const userId = req.user!.id;
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        project: true,
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
    });

    return {
      status: StatusCodes.OK,
      data: chats,
    };
  }),
};
