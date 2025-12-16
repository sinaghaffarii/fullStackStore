import type { CreateOptions, FindOptions } from 'sequelize';

import { Op } from 'sequelize';

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
    return Category.create(data, options);
  }

  async delete(id: string): Promise<boolean> {
    return (await Category.destroy({ where: { id } })) > 0;
  }

  async findAll(options?: FindOptions): Promise<Category[]> {
    return Category.findAll(options);
  }

  async findAndCountAll(
    options?: FindOptions,
  ): Promise<{ rows: Category[]; count: number }> {
    return Category.findAndCountAll(options);
  }

  async findById(id: string, options?: FindOptions): Promise<Category | null> {
    return Category.findByPk(id, options);
  }

  async findByParentId(parentId: string): Promise<Category[]> {
    return Category.findAll({
      where: { parent_id: parentId },
      include: [{ model: Category, as: 'children' }],
    });
  }

  async findHierarchy(): Promise<Category[]> {
    return Category.findAll({
      where: {
        parent_id: { [Op.eq]: null },
      },
      include: [
        {
          model: Category,
          as: 'children',
          include: [{ model: Category, as: 'children' }],
        },
      ],
    });
  }

  async update(
    id: string,
    data: Partial<CategoryAttributes>,
  ): Promise<Category> {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }

    await category.update(data); // ✅ overload سالم
    return category;
  }
}
