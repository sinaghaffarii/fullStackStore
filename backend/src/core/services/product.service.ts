import { Op, WhereOptions } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/errors/app-error';
import { ProductRepository } from '../repositories/product.repository';
import {
  Product,
  ProductAttributes,
  ProductCreationAttributes,
} from '../../infrastructure/database/models/product.model';
import { Category } from '../../infrastructure/database/models/category.model';

// استفاده از ProductCreationAttributes به جای تعریف مجدد
export interface CreateProductDTO
  extends Omit<ProductCreationAttributes, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateProductDTO
  extends Partial<
    Omit<ProductCreationAttributes, 'id' | 'created_at' | 'updated_at'>
  > {}

export interface ProductFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  attributes?: Record<string, any>;
  search?: string;
}

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(data: CreateProductDTO): Promise<Product> {
    // Validate category exists
    const category = await Category.findByPk(data.category_id);
    if (!category) {
      throw new AppError('Category not found', StatusCodes.NOT_FOUND);
    }

    // Validate base price
    if (data.base_price < 0) {
      throw new AppError('Price cannot be negative', StatusCodes.BAD_REQUEST);
    }

    // Validate stock quantity
    const stock_quantity = data.stock_quantity ?? 0;
    if (stock_quantity < 0) {
      throw new AppError(
        'Stock quantity cannot be negative',
        StatusCodes.BAD_REQUEST,
      );
    }

    // Ensure attributes is an object
    const attributes = data.attributes || {};

    const productData: ProductCreationAttributes = {
      ...data,
      stock_quantity,
      attributes,
    };

    return await this.productRepository.create(productData);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    return product;
  }

  async listProducts(
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: WhereOptions<any> = { is_active: true };

    // Category filter
    if (filters.category_id) {
      where.category_id = filters.category_id;
    }

    // Price range filter
    if (filters.min_price !== undefined || filters.max_price !== undefined) {
      (where as any).base_price = {};
      if (filters.min_price !== undefined) {
        (where as any).base_price[Op.gte] = filters.min_price;
      }
      if (filters.max_price !== undefined) {
        (where as any).base_price[Op.lte] = filters.max_price;
      }
    }

    // Stock filter
    if (filters.in_stock) {
      (where as any).stock_quantity = { [Op.gt]: 0 };
    }

    // Search filter
    if (filters.search) {
      (where as any)[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // JSONB attributes filter
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      Object.entries(filters.attributes).forEach(([key, value]) => {
        (where as any)[`attributes.${key}`] = value;
      });
    }

    const offset = (page - 1) * limit;

    const result = await this.productRepository.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      products: result.rows,
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
    };
  }
  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
    const product = await this.getProductById(id);

    // Validate category if provided
    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw new AppError('Category not found', StatusCodes.NOT_FOUND);
      }
    }

    // Clean undefined values
    const updateData: Partial<ProductAttributes> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData as any)[key] = value;
      }
    });

    return await this.productRepository.update(id, updateData);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);
    await this.productRepository.update(id, { is_active: false });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);

    if (quantity < 0) {
      throw new AppError(
        'Stock quantity cannot be negative',
        StatusCodes.BAD_REQUEST,
      );
    }

    return await this.productRepository.update(id, {
      stock_quantity: quantity,
    });
  }

  async getProductsByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.listProducts({ category_id: categoryId }, page, limit);
  }
}
