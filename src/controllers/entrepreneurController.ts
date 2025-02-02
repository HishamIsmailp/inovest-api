import { Request } from "express";
import { asyncHandler, ApiResponse, ApiError, StatusCodes } from "../utils";
import { prisma } from "../config";

export const entrepreneurController = {
  createIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { title, abstract, expectedInvestment, categoryId } = req.body;
    const entrepreneurId = req.user!.id;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    const project = await prisma.project.create({
      data: {
        title,
        abstract,
        expectedInvestment,
        categoryId,
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

    return {
      status: StatusCodes.CREATED,
      data: project,
      message: "Project created successfully",
    };
  }),

  updateIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const { title, abstract, expectedInvestment, categoryId } = req.body;
    const entrepreneurId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        entrepreneurId,
      },
    });

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        abstract,
        expectedInvestment,
        categoryId,
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
      data: updated,
      message: "Project updated successfully",
    };
  }),

  deleteIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const entrepreneurId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        entrepreneurId,
      },
    });

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
    }

    await prisma.$transaction([
      prisma.projectRating.deleteMany({ where: { projectId: id } }),
      prisma.projectInterest.deleteMany({ where: { projectId: id } }),
      prisma.projectImage.deleteMany({ where: { projectId: id } }),
      prisma.payment.deleteMany({ where: { projectId: id } }),
      prisma.message.deleteMany({
        where: {
          chat: {
            projectId: id,
          },
        },
      }),
      prisma.chatParticipant.deleteMany({
        where: {
          chat: {
            projectId: id,
          },
        },
      }),
      prisma.chat.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);

    return {
      status: StatusCodes.OK,
      message: "Project deleted successfully",
    };
  }),

  listIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const entrepreneurId = req.user!.id;
    const { status, search } = req.query;

    const where: any = {
      entrepreneurId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search as string, mode: "insensitive" } },
              {
                abstract: { contains: search as string, mode: "insensitive" },
              },
            ],
          }
        : {}),
    };

    const projects = await prisma.project.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            ratings: true,
            interests: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const projectsWithStats = projects.map((project) => ({
      ...project,
      averageRating: project.ratings.length
        ? project.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
          project.ratings.length
        : 0,
      ratings: undefined,
    }));

    return {
      status: StatusCodes.OK,
      data: projectsWithStats,
    };
  }),

  updateStatus: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const { status } = req.body;
    const entrepreneurId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        entrepreneurId,
      },
      include: {
        interests: {
          include: {
            investor: true,
          },
        },
      },
    });

    if (!project) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { status },
      include: {
        category: true,
      },
    });

    await prisma.$transaction(
      project.interests.map((interest) =>
        prisma.notification.create({
          data: {
            userId: interest.investorId,
            type: "STATUS_CHANGE",
            title: "Project Status Updated",
            message: `Project "${project.title}" status has been updated to ${status}`,
          },
        })
      )
    );

    req.app.get("socketService").sendStatusChange(id, status);

    return {
      status: StatusCodes.OK,
      data: updated,
      message: "Project status updated successfully",
    };
  }),

  getNotifications: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const entrepreneurId = req.user!.id;

    const notifications = await prisma.notification.findMany({
      where: {
        userId: entrepreneurId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      status: StatusCodes.OK,
      data: notifications,
    };
  }),

  getChats: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const entrepreneurId = req.user!.id;

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: entrepreneurId,
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
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        messages: {
          _count: "desc",
        },
      },
    });

    return {
      status: StatusCodes.OK,
      data: chats,
    };
  }),

  getDashboardStats: asyncHandler(
    async (req: Request): Promise<ApiResponse> => {
      const entrepreneurId = req.user!.id;

      const stats = await prisma.$transaction([
        prisma.project.count({
          where: { entrepreneurId },
        }),
        prisma.project.groupBy({
          by: ["status"],
          where: { entrepreneurId },
          _count: true,
          orderBy: {
            _count: {
              status: "desc",
            },
          },
        }),
        prisma.projectInterest.count({
          where: {
            project: {
              entrepreneurId,
            },
          },
        }),
        prisma.projectRating.aggregate({
          where: {
            project: {
              entrepreneurId,
            },
          },
          _avg: {
            rating: true,
          },
        }),
        prisma.projectInterest.findMany({
          where: {
            project: {
              entrepreneurId,
            },
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
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        }),
      ]);

      return {
        status: StatusCodes.OK,
        data: {
          totalProjects: stats[0],
          projectsByStatus: stats[1],
          totalInterests: stats[2],
          averageRating: stats[3]._avg.rating || 0,
          recentInterests: stats[4],
        },
      };
    }
  ),
};
