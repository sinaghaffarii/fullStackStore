import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import type { CategoryRepository } from '../repositories/category.repository';
import type { ICategory } from '../types/category.types';

import { AppError } from '../../../shared/errors/app-error';

interface ListCategoriesParams {
  page: number;
  limit: number;
  includeChildren: boolean;
  parentId?: string;
  isActive?: boolean;
  search?: string;
}

export class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async createCategory(dto: CreateCategoryDto): Promise<ICategory> {
    if (dto.slug) {
      const existing = await this.repository.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new Error('Slug already exists');
      }
    }

    if (dto.parent_id) {
      const parent = await this.repository.findById(dto.parent_id);
      if (!parent) {
        throw new Error('Parent category not found');
      }
    }

    const maxSort = await this.repository.max('sort_order', {
      where: { parent_id: dto.parent_id || null },
    });

    return this.repository.create({
      ...dto,
      sort_order: dto.sort_order ?? maxSort + 1,
    });
  }

  async deleteCategory(id: string): Promise<void> {
    const hasChildren = await this.repository.count({
      where: { parent_id: id },
    });

    if (hasChildren > 0) {
      throw new AppError(
        'زیرمجموعه دارد، حذف ممکن نیست.',
        StatusCodes.CONFLICT,
      );
    }

    await this.repository.delete(id);
  }

  async getBreadcrumb(categoryId: string): Promise<ICategory[]> {
    const breadcrumb: ICategory[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      // eslint-disable-next-line no-await-in-loop
      const cat = await this.repository.findById(currentId);
      if (!cat) break;
      breadcrumb.unshift(cat);
      currentId = cat.parent_id || null;
    }

    return breadcrumb;
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getCategoryHierarchy(): Promise<ICategory[]> {
    const categories = await this.repository.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC']],
    });

    return this.buildTree(categories);
  }

  async getFullSlugPath(categoryId: string): Promise<string> {
    const breadcrumb = await this.getBreadcrumb(categoryId);
    return breadcrumb.map((c) => c.slug).join('/');
  }

  async getSubcategories(parentId: string): Promise<ICategory[]> {
    return this.repository.findAll({
      where: { parent_id: parentId },
      order: [['sort_order', 'ASC']],
    });
  }

  async listCategories(params: ListCategoriesParams) {
    const { page, limit, includeChildren, parentId, isActive, search } = params;
    const offset = (page - 1) * limit;
    const where: any = {};

    if (parentId !== undefined) {
      where.parent_id = parentId || null;
    }

    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    const { rows, count } = await this.repository.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['sort_order', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });

    let items = rows;

    if (includeChildren) {
      const allCategories = await this.repository.findAll();
      items = items.map((item) => ({
        ...item,
        children: this.buildTree(allCategories, item.id),
      }));
    }

    return {
      items,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNext: page * limit < count,
        hasPrev: page > 1,
      },
    };
  }

  async searchCategories(query: string): Promise<ICategory[]> {
    return this.repository.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` },
      },
      order: [['sort_order', 'ASC']],
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.repository.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new Error('Slug already exists');
      }
    }

    if (dto.parent_id) {
      const ancestors = await this.getBreadcrumb(dto.parent_id);
      if (ancestors.some((a) => a.id === id)) {
        throw new Error('Cannot set category as its own parent');
      }
    }

    return this.repository.update(id, dto);
  }

  private buildTree(
    categories: ICategory[],
    parentId: string | null = null,
  ): ICategory[] {
    const tree: ICategory[] = [];

    for (const category of categories) {
      if (category.parent_id === parentId) {
        const children = this.buildTree(categories, category.id);
        const node: ICategory = { ...category };
        if (children.length > 0) {
          node.children = children;
        }
        tree.push(node);
      }
    }

    return tree.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }
}
