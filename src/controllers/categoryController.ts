import { Request } from "express";
import { asyncHandler, ApiResponse, StatusCodes } from "../utils";
import { categoryService } from "../services/categoryService";

export const categoryController = {
  createCategory: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const category = await categoryService.createCategory(req.body);

    return {
      status: StatusCodes.CREATED,
      data: category,
      message: "Category created successfully",
    };
  }),

  getAllCategories: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const includeProjectCount = req.query.includeProjectCount === "true";
    const categories =
      await categoryService.getAllCategories(includeProjectCount);

    return {
      status: StatusCodes.OK,
      data: categories,
    };
  }),

  getCategoryById: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const category = await categoryService.getCategoryById(req.params.id);

    return {
      status: StatusCodes.OK,
      data: category,
    };
  }),

  updateCategory: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    return {
      status: StatusCodes.OK,
      data: category,
      message: "Category updated successfully",
    };
  }),

  deleteCategory: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    await categoryService.deleteCategory(req.params.id);

    return {
      status: StatusCodes.OK,
      message: "Category deleted successfully",
    };
  }),
};
