import type { CreateOptions, FindOptions, UpdateOptions } from 'sequelize';

import type {
  ProductAttributes,
  ProductCreationAttributes,
} from '../../infrastructure/database/models';

import { Product } from '../../infrastructure/database/models';

export class ProductRepository {
  async create(
    data: ProductCreationAttributes,
    options?: CreateOptions,
  ): Promise<Product> {
    return await Product.create(data, options);
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.destroy({ where: { id } });
    return result > 0;
  }

  async findAll(options?: FindOptions): Promise<Product[]> {
    return await Product.findAll(options);
  }

  async findAndCountAll(
    options?: FindOptions,
  ): Promise<{ rows: Product[]; count: number }> {
    return await Product.findAndCountAll(options);
  }

  async findById(id: string, options?: FindOptions): Promise<Product | null> {
    return await Product.findByPk(id, options);
  }

  async update(
    id: string,
    data: Partial<ProductAttributes>,
    options?: Omit<UpdateOptions, 'where'>,
  ): Promise<Product> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.update(data, options as any);
    return product;
  }
}
