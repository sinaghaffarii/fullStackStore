import type { FindOptions, WhereOptions } from 'sequelize';

import type { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import type { ICategory } from '../types/category.types';

import Category from '../models/category.model';

export class CategoryRepository {
  async count(options?: { where?: WhereOptions }): Promise<number> {
    return Category.count(options);
  }

  async create(data: CreateCategoryDto): Promise<ICategory> {
    const category = await Category.create(data as any);
    return category.toJSON() as ICategory;
  }

  async delete(id: string): Promise<void> {
    await Category.destroy({ where: { id } });
  }

  async findAll(options?: FindOptions): Promise<ICategory[]> {
    const categories = await Category.findAll(options);
    return categories.map((c: Category) => c.toJSON() as ICategory);
  }

  async findAndCountAll(
    options: FindOptions,
  ): Promise<{ rows: ICategory[]; count: number }> {
    const { rows, count } = await Category.findAndCountAll(options);
    return {
      rows: rows.map((r: Category) => r.toJSON() as ICategory),
      count,
    };
  }

  async findById(id: string): Promise<ICategory | null> {
    const category = await Category.findByPk(id);
    return category ? (category.toJSON() as ICategory) : null;
  }

  async findOne(options: FindOptions): Promise<ICategory | null> {
    const category = await Category.findOne(options);
    return category ? (category.toJSON() as ICategory) : null;
  }

  async max(
    field: 'sort_order',
    options?: { where?: WhereOptions },
  ): Promise<number> {
    const result = await Category.max(field, options);
    return result ? Number(result) : 0;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<ICategory> {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');

    const sanitizedData: any = { ...data };
    if (sanitizedData.parent_id === null) sanitizedData.parent_id = undefined;

    await category.update(sanitizedData);
    return category.toJSON() as ICategory;
  }
}
