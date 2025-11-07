import type { CreateOptions, FindOptions, UpdateOptions } from 'sequelize';

import type {
  CategoryAttributes,
  CategoryCreationAttributes,
} from '../../infrastructure/database/models';

import { Category } from '../../infrastructure/database/models';

export class CategoryRepository {
  async create(
    data: CategoryCreationAttributes,
    options?: CreateOptions,
  ): Promise<Category> {
    return await Category.create(data, options);
  }

  async delete(id: string): Promise<boolean> {
    const result = await Category.destroy({ where: { id } });
    return result > 0;
  }

  async findAll(options?: FindOptions): Promise<Category[]> {
    return await Category.findAll(options);
  }

  async findAndCountAll(
    options?: FindOptions,
  ): Promise<{ rows: Category[]; count: number }> {
    return await Category.findAndCountAll(options);
  }

  async findById(id: string, options?: FindOptions): Promise<Category | null> {
    return await Category.findByPk(id, options);
  }

  async findByParentId(parentId: string): Promise<Category[]> {
    return await Category.findAll({
      where: { parent_id: parentId },
      include: [
        {
          model: Category,
          as: 'children',
        },
      ],
    });
  }

  async findHierarchy(): Promise<Category[]> {
    return await Category.findAll({
      include: [
        {
          model: Category,
          as: 'children',
          include: [
            {
              model: Category,
              as: 'children',
            },
          ],
        },
      ],
      where: {
        parent_id: null,
      },
    });
  }

  async update(
    id: string,
    data: Partial<CategoryAttributes>,
    options?: Omit<UpdateOptions, 'where'>,
  ): Promise<Category> {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }

    await category.update(data, options as any);
    return category;
  }
}
