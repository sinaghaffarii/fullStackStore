import type { Order, Transaction, WhereOptions } from 'sequelize';

import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { PriceRange } from '../../../shared/types-enums/enums';
import type { PaginatedListResult } from '../../../shared/types-enums/paginated-list-result';
import type { CreateProductDto } from '../types/dto.type';
import type { EnrichedProduct } from '../types/response.type';

import { sequelize } from '../../../configs/database';
import { AppError } from '../../../shared/errors/app-error';
import {
  getStockStatus,
  PRICE_RANGE_VALUES,
  ProductStatus,
  SortOption,
} from '../../../shared/types-enums/enums';
import { buildPagination } from '../../../shared/utils/pagination';
import Brand from '../../brands/models/brand.model';
import Category from '../../categories/models/category.model';
import Discount from '../../discount/models/discount.model';
import ProductImage from '../models/product-image.model';
import ProductVariant from '../models/product-variant.model';
import Product from '../models/product.model';

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
  status?: ProductStatus;
}

export class ProductService {
  async create(dto: CreateProductDto): Promise<Product> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const slug = await this.generateSlug(dto.slug, transaction);

      const product = await Product.create(
        {
          name: dto.name,
          slug,
          description: dto.description,
          base_price: dto.base_price,
          category_id: dto.category_id,
          brand_id: dto.brand_id,
          tags: dto.tags || [],
          specifications: dto.specifications || {},
          is_featured: dto.is_featured ?? false,
          is_new: dto.is_new ?? true,
          status: dto.status || ProductStatus.ACTIVE,
        },
        { transaction },
      );

      const productData = product.get({ plain: true });

      if (dto.variants?.length) {
        const variantsToCreate = dto.variants.map((v, index) => {
          const variantData = v;
          const finalVariantData = {
            ...variantData,
            product_id: productData.id,
            sku: this.generateSku(productData.id, index),
          };
          return finalVariantData;
        });

        await ProductVariant.bulkCreate(variantsToCreate, { transaction });
      }

      if (dto.images?.length) {
        const imagesToCreate = dto.images.map((img, index) => ({
          product_id: productData.id,
          url: img.url,
          alt: img.alt,
          sort_order: img.sort_order ?? index,
          is_primary: img.is_primary ?? index === 0,
        }));

        await ProductImage.bulkCreate(imagesToCreate, { transaction });
      }
      return product;
    });
  }

  async delete(id: string): Promise<void> {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }
    await product.update({ status: ProductStatus.INACTIVE });
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

    return this.enrichProduct(product);
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
    return this.enrichProduct(product);
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
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name', 'name_fa', 'logo'],
        },
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
          order: [['sort_order', 'ASC']],
        },
      ],
      limit,
      offset,
      order,
      distinct: true,
    });

    const items = await Promise.all(rows.map((p) => this.enrichProduct(p)));

    return {
      items,
      pagination: buildPagination(count, page, limit),
    };
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const product = await Product.findByPk(id, { transaction });
      if (!product) {
        throw new AppError('Product not found', StatusCodes.NOT_FOUND);
      }

      let newSlug = product.slug;
      if (dto.name && dto.name !== product.name) {
        newSlug = await this.generateSlug(dto.name, transaction);
      }

      await product.update(
        {
          name: dto.name,
          slug: newSlug,
          description: dto.description,
          base_price: dto.base_price,
          category_id: dto.category_id,
          brand_id: dto.brand_id,
          tags: dto.tags,
          specifications: dto.specifications,
          is_featured: dto.is_featured,
          is_new: dto.is_new,
          status: dto.status,
        },
        { transaction },
      );

      if (dto.variants) {
        await ProductVariant.destroy({
          where: { product_id: id },
          transaction,
        });

        await ProductVariant.bulkCreate(
          dto.variants.map((v, index) => ({
            ...v,
            product_id: id,
            sku: this.generateSku(id, index),
          })),
          { transaction },
        );
      }

      if (dto.images) {
        await ProductImage.destroy({ where: { product_id: id }, transaction });

        await ProductImage.bulkCreate(
          dto.images.map((img, index) => ({
            product_id: id,
            url: img.url,
            alt: img.alt,
            sort_order: img.sort_order ?? index,
            is_primary: img.is_primary ?? index === 0,
          })),
          { transaction },
        );
      }

      return product.reload({ transaction });
    });
  }

  async updateStock(variantId: string, stock: number): Promise<ProductVariant> {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      throw new AppError('Variant not found', StatusCodes.NOT_FOUND);
    }
    await variant.update({ stock });
    return variant;
  }

  private buildOrder(sort: SortOption): Order {
    const orderMap: Record<SortOption, Order> = {
      [SortOption.NEWEST]: [['created_at', 'DESC']],
      [SortOption.OLDEST]: [['created_at', 'ASC']],
      [SortOption.PRICE_LOW]: [['base_price', 'ASC']],
      [SortOption.PRICE_HIGH]: [['base_price', 'DESC']],
      [SortOption.BEST_SELLING]: [['sales_count', 'DESC']],
      [SortOption.MOST_POPULAR]: [['view_count', 'DESC']],
      [SortOption.HIGHEST_RATED]: [['rating', 'DESC']],
    };
    return orderMap[sort];
  }

  private buildWhere(filters: ProductFilters): WhereOptions {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    } else {
      where.status = ProductStatus.ACTIVE;
    }

    if (filters.category_id) where.category_id = filters.category_id;
    if (filters.brand_id) where.brand_id = filters.brand_id;
    if (filters.is_featured !== undefined)
      where.is_featured = filters.is_featured;
    if (filters.is_new !== undefined) where.is_new = filters.is_new;

    if (filters.price_range && PRICE_RANGE_VALUES[filters.price_range]) {
      const { min, max } = PRICE_RANGE_VALUES[filters.price_range];
      where.base_price = { [Op.gte]: min };
      if (max) where.base_price[Op.lte] = max;
    } else {
      if (filters.min_price) {
        where.base_price = { ...where.base_price, [Op.gte]: filters.min_price };
      }
      if (filters.max_price) {
        where.base_price = { ...where.base_price, [Op.lte]: filters.max_price };
      }
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
        { tags: { [Op.overlap]: [filters.search] } },
      ];
    }

    if (filters.tags?.length) {
      where.tags = { [Op.overlap]: filters.tags };
    }

    return where;
  }

  private async enrichProduct(product: Product): Promise<EnrichedProduct> {
    const productData = product.get({ plain: true }) as Product;
    const variants = productData.variants || [];
    const images = productData.images || [];

    const discount = await Discount.findActiveForProduct();

    const discountAmount = discount?.calculate(productData.base_price) || 0;
    const finalPrice = productData.base_price - discountAmount;
    const discountPercent =
      discountAmount > 0
        ? Math.round((discountAmount / productData.base_price) * 100)
        : 0;

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const colors = this.extractColors(variants);
    const sizes = this.extractSizes(variants);

    const categoryInfo = productData.category
      ? {
          id: productData.category.id,
          name: productData.category.name,
          slug: productData.category.slug,
        }
      : undefined;

    const brandInfo = productData.brand
      ? {
          id: productData.brand.id,
          name: productData.brand.name,
          name_fa: productData.brand.name_fa,
          logo: productData.brand.logo,
        }
      : undefined;

    return {
      id: productData.id,
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      base_price: productData.base_price,
      final_price: finalPrice,
      discount_amount: discountAmount,
      discount_percent: discountPercent,
      price_display: {
        base: Math.round(productData.base_price / 10),
        final: Math.round(finalPrice / 10),
        currency: 'تومان',
        discount_percent: discountPercent,
      },
      primary_image: images.find((i) => i.is_primary)?.url || images[0]?.url,
      images: images.map((i) => ({ url: i.url, alt: i.alt })),
      variants,
      stock_status: getStockStatus(totalStock),
      total_stock: totalStock,
      colors,
      sizes,
      category: categoryInfo,
      brand: brandInfo,
      rating: Number(productData.rating),
      review_count: productData.review_count,
      sales_count: productData.sales_count,
      view_count: productData.view_count,
      is_featured: productData.is_featured,
      is_new: productData.is_new,
      status: productData.status,
      specifications: productData.specifications,
      tags: productData.tags,
      active_discount: discount
        ? {
            id: discount.id,
            name: discount.name,
            type: discount.type,
            value: discount.value,
            badge_text: discount.badge_text,
          }
        : undefined,
      created_at: productData.created_at,
      updated_at: productData.updated_at,
    };
  }

  private extractColors(variants: any[]): { label: string; value: string }[] {
    const colorsMap = new Map<string, { label: string; value: string }>();
    variants.forEach((v) => {
      v.options?.forEach((opt: any) => {
        if (opt.type === 'color' && !colorsMap.has(opt.value)) {
          colorsMap.set(opt.value, { label: opt.label, value: opt.value });
        }
      });
    });
    return Array.from(colorsMap.values());
  }

  private extractSizes(variants: any[]): string[] {
    const sizes = new Set<string>();
    variants.forEach((v) => {
      v.options?.forEach((opt: any) => {
        if (opt.type === 'size') sizes.add(opt.value);
      });
    });
    return Array.from(sizes);
  }

  private generateSku(productId: string, index: number): string {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRD-${productId}-${random}-${index}`;
  }

  private async generateSlug(
    name: string,
    transaction: Transaction,
  ): Promise<string> {
    const baseSlug = name
      .toString()
      .normalize('NFD')
      .replace(/[\u064b-\u0652]/g, '')
      .replace(/٪/g, 'percent')
      .replace(/[^\s\w-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();

    let finalSlug = baseSlug;
    let counter = 1;

    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await Product.findOne({
        where: { slug: finalSlug },
        transaction,
      });

      if (!exists) break;

      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return finalSlug;
  }
}
