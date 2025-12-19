import type { Order, WhereOptions } from 'sequelize';

import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type {
  PriceRange,
  StockStatus,
} from '../../infrastructure/database/models/shared';
import type { PaginatedListResult } from '../../shared/types-enums/paginated-list-result';
import type { ProductRepository } from '../repositories/product.repository';

import {
  Brand,
  Category,
  Discount,
  getStockStatus,
  PRICE_RANGE_VALUES,
  Product,
  ProductImage,
  ProductStatus,
  ProductVariant,
  SortOption,
} from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';
import { buildPagination } from '../../shared/utils/pagination';

// DTOs
export interface ProductFilters {
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  price_range?: PriceRange;
  in_stock?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  search?: string;
  tags?: string[];
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  products: EnrichedProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EnrichedProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  final_price: number;
  discount_percent: number;
  primary_image?: string;
  stock_status: StockStatus;
  colors: { label: string; value: string }[];
  sizes: string[];
  category: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; name_fa: string };
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_new: boolean;
}

export class ProductService {
  constructor(private repo: ProductRepository) {}

  async create(data: any): Promise<Product> {
    return Product.create(data);
  }

  async delete(id: string): Promise<void> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    await product.destroy();
  }

  async getById(id: string): Promise<EnrichedProduct> {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        {
          model: ProductVariant,
          as: 'variants',
          where: { is_active: true },
          required: false,
        },
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
      ],
    });

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    return this.enrich(product);
  }
  async getBySlug(slug: string): Promise<EnrichedProduct> {
    const product = await Product.findOne({
      where: { slug, status: ProductStatus.ACTIVE },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        {
          model: ProductVariant,
          as: 'variants',
          where: { is_active: true },
          required: false,
        },
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
      ],
    });

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    await product.increment('view_count');
    return this.enrich(product);
  }

  async list(
    filters: ProductFilters = {},
  ): Promise<PaginatedListResult<EnrichedProduct>> {
    const { page = 1, limit = 12, sort = SortOption.NEWEST } = filters;
    const offset = (page - 1) * limit;

    const where = this.buildWhere(filters);
    const order = this.buildOrder(sort);

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'name_fa'] },
        {
          model: ProductVariant,
          as: 'variants',
          where: { is_active: true },
          required: false,
        },
        {
          model: ProductImage,
          as: 'images',
          where: { is_primary: true },
          required: false,
        },
      ],
      limit,
      offset,
      order,
      distinct: true,
    });

    const items = await Promise.all(rows.map((p) => this.enrich(p)));

    return {
      items,
      pagination: buildPagination(count, page, limit),
    };
  }

  async update(id: string, data: any): Promise<Product> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    await product.update(data);
    return product;
  }

  async updateStock(variantId: string, stock: number): Promise<ProductVariant> {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      throw new AppError('Variant not found', StatusCodes.NOT_FOUND);
    }
    await variant.update({ stock });
    return variant;
  }

  // Helpers
  private buildOrder(sort: SortOption): Order {
    const orderMap: Record<SortOption, Order> = {
      [SortOption.NEWEST]: [['created_at', 'DESC']],
      [SortOption.OLDEST]: [['created_at', 'ASC']],
      [SortOption.PRICE_LOW]: [['base_price', 'ASC']],
      [SortOption.PRICE_HIGH]: [['base_price', 'DESC']],
      [SortOption.BEST_SELLING]: [['sales_count', 'DESC']],
      [SortOption.MOST_POPULAR]: [['rating', 'DESC']],
    };
    return orderMap[sort] || orderMap[SortOption.NEWEST];
  }

  private buildWhere(filters: ProductFilters): WhereOptions<any> {
    const where: any = { status: ProductStatus.ACTIVE };

    if (filters.category_id) where.category_id = filters.category_id;
    if (filters.brand_id) where.brand_id = filters.brand_id;
    if (filters.is_featured) where.is_featured = true;
    if (filters.is_new) where.is_new = true;

    if (filters.price_range && PRICE_RANGE_VALUES[filters.price_range]) {
      const { min, max } = PRICE_RANGE_VALUES[filters.price_range];
      where.base_price = { [Op.gte]: min };
      if (max) where.base_price[Op.lte] = max;
    } else {
      if (filters.min_price)
        where.base_price = { ...where.base_price, [Op.gte]: filters.min_price };
      if (filters.max_price)
        where.base_price = { ...where.base_price, [Op.lte]: filters.max_price };
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    if (filters.tags?.length) {
      where.tags = { [Op.overlap]: filters.tags };
    }

    return where;
  }

  private async enrich(product: Product): Promise<EnrichedProduct> {
    const variants = product.variants || [];
    const images = product.images || [];

    const discount = await Discount.findActiveForProduct(
      product.id,
      product.category_id,
      product.brand_id || undefined,
    );

    const discountAmount = discount?.calculate(product.base_price) || 0;
    const finalPrice = product.base_price - discountAmount;
    const discountPercent =
      discountAmount > 0
        ? Math.round((discountAmount / product.base_price) * 100)
        : 0;

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    const colors: { label: string; value: string }[] = [];
    const sizes: string[] = [];

    variants.forEach((v) => {
      v.options.forEach((opt: any) => {
        if (
          opt.type === 'color' &&
          !colors.find((c) => c.value === opt.value)
        ) {
          colors.push({ label: opt.label, value: opt.value });
        }
        if (opt.type === 'size' && !sizes.includes(opt.value)) {
          sizes.push(opt.value);
        }
      });
    });

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      base_price: product.base_price,
      final_price: finalPrice,
      discount_percent: discountPercent,
      primary_image: images.find((i) => i.is_primary)?.url || images[0]?.url,
      stock_status: getStockStatus(totalStock),
      colors,
      sizes,
      category: {
        id: product.category?.id,
        name: product.category?.name,
        slug: product.category?.slug,
      },
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            name_fa: product.brand.name_fa,
          }
        : undefined,
      rating: Number(product.rating),
      review_count: product.review_count,
      is_featured: product.is_featured,
      is_new: product.is_new,
    };
  }
}
