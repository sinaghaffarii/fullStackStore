import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { BrandAttributes } from '../../infrastructure/database/models';

import { Brand } from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';

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

  async list(query: any): Promise<{ brands: Brand[]; total: number }> {
    const { page = 1, limit = 50, search, is_active: isActive } = query;

    const where: any = {};
    if (typeof isActive !== 'undefined') where.is_active = isActive;
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

    return { brands: rows, total: count };
  }

  async update(id: string, data: Partial<CreateBrandDTO>): Promise<Brand> {
    const brand = await this.getById(id);
    await brand.update(data);
    return brand;
  }
}
