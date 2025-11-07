import { StatusCodes } from 'http-status-codes';

import type {
  CategoryAttributes,
  CategoryCreationAttributes,
} from '../../infrastructure/database/models/category.model';
import type { CategoryRepository } from '../repositories/category.repository';

import { Category } from '../../infrastructure/database/models/category.model';
import { AppError } from '../../shared/errors/app-error';

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
    // Validate parent category if provided
    if (data.parent_id) {
      const parentCategory = await this.categoryRepository.findById(
        data.parent_id,
      );
      if (!parentCategory) {
        throw new AppError('Parent category not found', StatusCodes.NOT_FOUND);
      }
    }

    // Check for duplicate name in the same parent
    const existingCategory = await this.categoryRepository.findAll({
      where: {
        name: data.name,
        parent_id: data.parent_id || null,
      },
    });

    if (existingCategory.length > 0) {
      throw new AppError(
        'Category name already exists in this level',
        StatusCodes.CONFLICT,
      );
    }

    const categoryData: CategoryCreationAttributes = {
      ...data,
    };

    return await this.categoryRepository.create(categoryData);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);

    // Check if category has children
    const children = await this.categoryRepository.findByParentId(id);
    if (children.length > 0) {
      throw new AppError(
        'Cannot delete category with subcategories. Please delete subcategories first.',
        StatusCodes.CONFLICT,
      );
    }

    // Check if category has products
    const { Product } = await import(
      '../../infrastructure/database/models/product.model'
    );
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
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name'],
        },
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
    return await this.categoryRepository.findHierarchy();
  }

  async getSubcategories(parentId: string): Promise<Category[]> {
    return await this.categoryRepository.findByParentId(parentId);
  }

  async listCategories(
    page: number = 1,
    limit: number = 10,
    includeChildren: boolean = false,
  ): Promise<{
    categories: Category[];
    total: number;
    page: number;
    totalPages: number;
  }> {
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

    const result = await this.categoryRepository.findAndCountAll({
      include,
      limit,
      offset,
      order: [['created_at', 'ASC']],
    });

    return {
      categories: result.rows,
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
    };
  }

  async searchCategories(query: string): Promise<Category[]> {
    return await this.categoryRepository.findAll({
      where: {
        $or: [
          { name: { $iLike: `%${query}%` } },
          { description: { $iLike: `%${query}%` } },
        ],
      } as any,
      limit: 10,
    });
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const category = await this.getCategoryById(id);

    // Validate parent category if provided (prevent circular reference)
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

      // Check for circular reference
      let currentParent = parentCategory;
      while (currentParent.parent_id) {
        if (currentParent.parent_id === id) {
          throw new AppError(
            'Circular reference detected in category hierarchy',
            StatusCodes.BAD_REQUEST,
          );
        }
        const nextParent = await this.categoryRepository.findById(
          currentParent.parent_id,
        );
        if (!nextParent) break;
        currentParent = nextParent;
      }
    }

    // Check for duplicate name if name is being updated
    if (data.name) {
      const existingCategory = await this.categoryRepository.findAll({
        where: {
          name: data.name,
          parent_id:
            data.parent_id !== undefined ? data.parent_id : category.parent_id,
          id: { $not: id } as any,
        },
      });

      if (existingCategory.length > 0) {
        throw new AppError(
          'Category name already exists in this level',
          StatusCodes.CONFLICT,
        );
      }
    }

    // Clean undefined values
    const updateData: Partial<CategoryAttributes> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });

    return await this.categoryRepository.update(id, updateData);
  }
}
