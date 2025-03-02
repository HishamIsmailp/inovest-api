import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError, StatusCodes } from "../utils";
import { prisma } from "../config";
import { entrepreneurService } from "../services/entrepreneurService";

export const entrepreneurController = {
  createIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const project = await entrepreneurService.createIdea(
      req.user!.id,
      req.body
    );

    return {
      status: StatusCodes.CREATED,
      data: project,
      message: "Project created successfully",
    };
  }),

  updateIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const updated = await entrepreneurService.updateIdea(
      req.user!.id,
      req.params.id,
      req.body
    );

    return {
      status: StatusCodes.OK,
      data: updated,
      message: "Project updated successfully",
    };
  }),

  deleteIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    await entrepreneurService.deleteIdea(req.user!.id, req.params.id);

    return {
      status: StatusCodes.OK,
      message: "Project deleted successfully",
    };
  }),

  listIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const ideas = await entrepreneurService.listIdeas(req.user!.id);

    return {
      status: StatusCodes.OK,
      data: ideas,
    };
  }),

  updateStatus: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const updated = await entrepreneurService.updateStatus(
      req.user!.id,
      req.params.id,
      req.body.status
    );

    return {
      status: StatusCodes.OK,
      data: updated,
      message: "Project status updated successfully",
    };
  }),

  getNotifications: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const notifications = await entrepreneurService.getNotifications(
      req.user!.id
    );

    return {
      status: StatusCodes.OK,
      data: notifications,
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

  initializeChat: async (req: Request, res: Response): Promise<Response> => {
    try {
      const entrepreneurId = req.user!.id;
      const { investorId, projectId } = req.params;
      
      const result = await entrepreneurService.initializeChat(entrepreneurId, investorId, projectId);
      
      return res.status(200).json({
        success: true,
        chatId: result.chatId,
        message: 'Chat initialized successfully'
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize chat'
      });
    }
  },
};
