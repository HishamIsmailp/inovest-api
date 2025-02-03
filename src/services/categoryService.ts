import { prisma } from "../config";
import { ApiError, StatusCodes } from "../utils";
import { CreateCategoryDto, UpdateCategoryDto } from "../types/category";

export class CategoryService {
  async createCategory(data: CreateCategoryDto) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Category with this name already exists"
      );
    }

    return prisma.category.create({
      data,
    });
  }

  async getAllCategories(includeProjectCount: boolean = false) {
    return prisma.category.findMany({
      include: {
        _count: includeProjectCount
          ? {
              select: { projects: true },
            }
          : false,
      },
      orderBy: { name: "asc" },
    });
  }

  async getCategoryById(id: string) {
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

    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category not found");
    }

    if (data.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: data.name,
          NOT: {
            id,
          },
        },
      });

      if (existingCategory) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "Category with this name already exists"
        );
      }
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
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

    if (category._count.projects > 0) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Cannot delete category with existing projects"
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService(); 