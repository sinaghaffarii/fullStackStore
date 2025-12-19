import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type {
  CategoryAttributes,
  CategoryCreationAttributes,
} from '../../infrastructure/database/models';
import type { PaginatedListResult } from '../../shared/types-enums/paginated-list-result';
import type { CategoryRepository } from '../repositories/category.repository';

import { Category, Product } from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';
import { buildPagination } from '../../shared/utils/pagination';

export interface CreateCategoryDTO
  extends Omit<
    CategoryCreationAttributes,
    'created_at' | 'id' | 'updated_at'
  > {}

export interface UpdateCategoryDTO
  extends Partial<
    Omit<CategoryCreationAttributes, 'created_at' | 'id' | 'updated_at'>
  > {}

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    if (data.parent_id) {
      const parentCategory = await this.categoryRepository.findById(
        data.parent_id,
      );
      if (!parentCategory) {
        throw new AppError('Parent category not found', StatusCodes.NOT_FOUND);
      }
    }

    const existingCategory = await this.categoryRepository.findAll({
      where: { name: data.name, parent_id: data.parent_id || null },
    });

    if (existingCategory.length > 0) {
      throw new AppError(
        'Category name already exists in this level',
        StatusCodes.CONFLICT,
      );
    }

    const categoryData: CategoryCreationAttributes = { ...data };
    return this.categoryRepository.create(categoryData);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id);

    const children = await this.categoryRepository.findByParentId(id);
    if (children.length > 0) {
      throw new AppError(
        'Cannot delete category with subcategories. Please delete subcategories first.',
        StatusCodes.CONFLICT,
      );
    }

    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) {
      throw new AppError(
        'Cannot delete category with associated products. Please reassign products first.',
        StatusCodes.CONFLICT,
      );
    }

    await this.categoryRepository.delete(id);
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id, {
      include: [
        { model: Category, as: 'parent', attributes: ['id', 'name'] },
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (!category) {
      throw new AppError('Category not found', StatusCodes.NOT_FOUND);
    }

    return category;
  }

  async getCategoryHierarchy(): Promise<Category[]> {
    return this.categoryRepository.findHierarchy();
  }

  async getSubcategories(parentId: string): Promise<Category[]> {
    return this.categoryRepository.findByParentId(parentId);
  }

  async listCategories(
    page = 1,
    limit = 10,
    includeChildren = false,
  ): Promise<PaginatedListResult<Category>> {
    const offset = (page - 1) * limit;

    const include = includeChildren
      ? [
          {
            model: Category,
            as: 'children',
            attributes: ['id', 'name', 'description'],
          },
        ]
      : [];

    const { rows, count } = await this.categoryRepository.findAndCountAll({
      include,
      limit,
      offset,
      order: [['created_at', 'ASC']],
    });

    return {
      items: rows,
      pagination: buildPagination(count, page, limit),
    };
  }

  async searchCategories(query: string): Promise<Category[]> {
    return this.categoryRepository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: 10,
    });
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (data.parent_id) {
      if (data.parent_id === id) {
        throw new AppError(
          'Category cannot be its own parent',
          StatusCodes.BAD_REQUEST,
        );
      }

      const parentCategory = await this.categoryRepository.findById(
        data.parent_id,
      );
      if (!parentCategory) {
        throw new AppError('Parent category not found', StatusCodes.NOT_FOUND);
      }

      const hasCycle = await this.hasCircularReference(data.parent_id, id);
      if (hasCycle) {
        throw new AppError(
          'Circular reference detected in category hierarchy',
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (data.name) {
      const existingCategory = await this.categoryRepository.findAll({
        where: {
          name: data.name,
          parent_id:
            data.parent_id !== undefined ? data.parent_id : category.parent_id,
          id: { [Op.ne]: id },
        },
      });

      if (existingCategory.length > 0) {
        throw new AppError(
          'Category name already exists in this level',
          StatusCodes.CONFLICT,
        );
      }
    }

    const updateData: Partial<CategoryAttributes> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });

    return this.categoryRepository.update(id, updateData);
  }

  private async hasCircularReference(
    parentId: string,
    selfId: string,
  ): Promise<boolean> {
    const parent = await this.categoryRepository.findById(parentId);
    if (!parent) return false;
    if (parent.parent_id === selfId) return true;
    if (parent.parent_id) {
      return this.hasCircularReference(parent.parent_id, selfId);
    }
    return false;
  }
}
