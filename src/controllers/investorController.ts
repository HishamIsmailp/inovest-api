import { Request } from "express";
import { ApiResponse, asyncHandler, StatusCodes } from "../utils";
import { investorService } from "../services/investorService";

export const investorController = {
  getCategories: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const categories = await investorService.getCategories();
    return {
      status: StatusCodes.OK,
      data: categories,
    };
  }),

  getTopIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const topIdeas = await investorService.getTopIdeas();
    return {
      status: StatusCodes.OK,
      data: topIdeas,
    };
  }),

  getIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const ideas = await investorService.getIdeas(req.user!.id);
    return {
      status: StatusCodes.OK,
      data: ideas,
    };
  }),

  getCategoryIdeas: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const ideas = await investorService.getCategoryIdeas(id, req.user!.id);
    return {
      status: StatusCodes.OK,
      data: ideas,
    };
  }),

  getIdeaDetail: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const idea = await investorService.getIdeaDetail(id);
    return {
      status: StatusCodes.OK,
      data: idea,
    };
  }),

  rateIdea: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const investorId = req.user!.id;

    const updatedRating = await investorService.rateIdea(
      investorId,
      id,
      rating,
      comment
    );

    return {
      status: StatusCodes.OK,
      data: updatedRating,
      message: "Rating updated successfully",
    };
  }),

  showInterest: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const investorId = req.user!.id;

    const interest = await investorService.showInterest(investorId, id);

    return {
      status: StatusCodes.CREATED,
      data: interest,
      message: "Interest shown successfully",
    };
  }),

  getInterests: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const investorId = req.user!.id;
    const interests = await investorService.getInterests(investorId);
    return {
      status: StatusCodes.OK,
      data: interests,
    };
  })
};
