import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { BrandAttributes } from '../models/brand.model';

import { AppError } from '../../../shared/errors/app-error';
import Brand from '../models/brand.model';

export interface CreateBrandDTO {
  name: string;
  name_fa: string;
  slug: string;
  logo?: string;
  is_active?: boolean;
}

export class BrandService {
  async create(data: CreateBrandDTO): Promise<Brand> {
    const exists = await Brand.findOne({ where: { slug: data.slug } });
    if (exists) {
      throw new AppError('Brand slug exists', StatusCodes.CONFLICT);
    }

    return Brand.create(data as Omit<BrandAttributes, 'id'>);
  }

  async delete(id: string): Promise<void> {
    const brand = await this.getById(id);
    await brand.destroy();
  }

  async getById(id: string): Promise<Brand> {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      throw new AppError('Brand not found', StatusCodes.NOT_FOUND);
    }
    return brand;
  }

  async list(query: any): Promise<{
    items: Brand[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const { search, is_active } = query;

    const where: any = {};

    if (typeof is_active !== 'undefined') {
      where.is_active = is_active;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { name_fa: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Brand.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async update(id: string, data: Partial<CreateBrandDTO>): Promise<Brand> {
    const brand = await this.getById(id);

    if (data.slug && data.slug !== brand.slug) {
      const exists = await Brand.findOne({
        where: {
          slug: data.slug,
          id: { [Op.ne]: id },
        },
      });
      if (exists) {
        throw new AppError('Brand slug exists', StatusCodes.CONFLICT);
      }
    }

    await brand.update(data);
    return brand;
  }
}
