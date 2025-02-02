import { Request } from "express";
import { asyncHandler, ApiResponse, ApiError, StatusCodes } from "../utils";
import { prisma } from "../config";

export const categoryController = {
  createCategory: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { name, description } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Category with this name already exists"
      );
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    return {
      status: StatusCodes.CREATED,
      data: category,
      message: "Category created successfully",
    };
  }),

  getAllCategories: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const includeProjectCount = req.query.includeProjectCount === "true";

    const categories = await prisma.category.findMany({
      include: {
        _count: includeProjectCount
          ? {
              select: { projects: true },
            }
          : false,
      },
      orderBy: { name: "asc" },
    });

    return {
      status: StatusCodes.OK,
      data: categories,
    };
  }),

  getCategoryById: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    return {
      status: StatusCodes.OK,
      data: category,
    };
  }),

  updateCategory: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (name && name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findUnique({
        where: { name },
      });

      if (duplicateCategory) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "Category with this name already exists"
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
    });

    return {
      status: StatusCodes.OK,
      data: updatedCategory,
      message: "Category updated successfully",
    };
  }),

  deleteCategory: asyncHandler(async (req: Request): Promise<ApiResponse> => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    const projectCount = await prisma.project.count({
      where: { categoryId: id },
    });

    if (projectCount > 0) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Cannot delete category with existing projects"
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return {
      status: StatusCodes.OK,
      message: "Category deleted successfully",
    };
  }),
};
