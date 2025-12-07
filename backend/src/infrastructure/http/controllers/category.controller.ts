import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type {
  CategoryService,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../../../core/services/category.service';

import { AppError } from '../../../shared/errors/app-error';
import { sendResponse } from '../../../shared/utils/response-handler';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const categoryData: CreateCategoryDTO = req.body;
    const category = await this.categoryService.createCategory(categoryData);

    sendResponse(res, StatusCodes.CREATED, {
      message: 'Category created successfully',
      data: category,
    });
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.categoryService.deleteCategory(id);

    sendResponse(res, StatusCodes.OK, {
      message: 'Category deleted successfully',
    });
  };

  getCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const category = await this.categoryService.getCategoryById(id);

    sendResponse(res, StatusCodes.OK, {
      message: 'Category retrieved successfully',
      data: category,
    });
  };

  getCategoryHierarchy = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const hierarchy = await this.categoryService.getCategoryHierarchy();

    sendResponse(res, StatusCodes.OK, {
      message: 'Category hierarchy retrieved successfully',
      data: hierarchy,
    });
  };

  getSubcategories = async (req: Request, res: Response): Promise<void> => {
    const { parentId } = req.params;
    const subcategories = await this.categoryService.getSubcategories(parentId);

    sendResponse(res, StatusCodes.OK, {
      message: 'Subcategories retrieved successfully',
      data: subcategories,
    });
  };

  listCategories = async (req: Request, res: Response): Promise<void> => {
    const {
      page = '1',
      limit = '10',
      include_children: includeChildrenParam = 'false',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 10),
    );
    const includeChildren = includeChildrenParam === 'true';

    const result = await this.categoryService.listCategories(
      pageNum,
      limitNum,
      includeChildren,
    );

    sendResponse(res, StatusCodes.OK, {
      message: 'Categories retrieved successfully',
      data: result,
    });
  };

  searchCategories = async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      throw new AppError('Search query is required', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const categories = await this.categoryService.searchCategories(q);

    sendResponse(res, StatusCodes.OK, {
      message: 'Categories search completed successfully',
      data: categories,
    });
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateCategoryDTO = req.body;
    const category = await this.categoryService.updateCategory(id, updateData);

    sendResponse(res, StatusCodes.OK, {
      message: 'Category updated successfully',
      data: category,
    });
  };
}
