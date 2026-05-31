import type { WhereOptions } from 'sequelize';

import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { DiscountScope } from '../../../shared/types-enums/enums';
import type { PaginatedListResult } from '../../../shared/types-enums/paginated-list-result';
import type { DiscountAttributes } from '../models/discount.model';

import { AppError } from '../../../shared/errors/app-error';
import { DiscountType } from '../../../shared/types-enums/enums';
import { buildPagination } from '../../../shared/utils/pagination';
import Discount from '../models/discount.model';

export type CreateDiscountDTO = Omit<DiscountAttributes, 'id'>;

export interface DiscountFilters {
  scope?: DiscountScope;
  is_active?: boolean;
  validOnly?: boolean;
  page?: number;
  limit?: number;
}

class DiscountService {
  private readonly dateFields = new Set(['ends_at', 'starts_at']);

  async create(data: CreateDiscountDTO): Promise<Discount> {
    this.validate(data);
    return Discount.create(data);
  }

  async delete(id: string): Promise<void> {
    const discount = await this.getById(id);
    await discount.destroy();
  }

  async getActiveBanners(): Promise<Discount[]> {
    const now = new Date();

    return Discount.findAll({
      where: {
        is_active: true,
        starts_at: { [Op.lte]: now },
        ends_at: { [Op.gte]: now },
        badge_text: { [Op.ne]: null as unknown as string },
      },
      order: [['value', 'DESC']],
      limit: 5,
    });
  }

  async getById(id: string): Promise<Discount> {
    const discount = await Discount.findByPk(id);
    if (!discount) {
      throw new AppError('Discount not found', StatusCodes.NOT_FOUND);
    }
    return discount;
  }

  async list(
    filters: DiscountFilters = {},
  ): Promise<PaginatedListResult<Discount>> {
    const { page = 1, limit = 20, is_active, validOnly } = filters;

    const where: WhereOptions<DiscountAttributes> = {};

    if (is_active !== undefined) where.is_active = is_active;

    if (validOnly) {
      const now = new Date();
      where.is_active = true;
      where.starts_at = { [Op.lte]: now };
      where.ends_at = { [Op.gte]: now };
    }

    const { rows, count } = await Discount.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    });

    return {
      items: rows,
      pagination: buildPagination(count, page, limit),
    };
  }

  async toggleActive(id: string): Promise<Discount> {
    const discount = await this.getById(id);
    const newIsActiveValue = !discount.dataValues.is_active;
    await discount.update({ is_active: newIsActiveValue });
    return discount;
  }

  async update(
    id: string,
    data: Partial<CreateDiscountDTO>,
  ): Promise<Discount> {
    const discount = await this.getById(id);
    await discount.update(data);
    return discount;
  }

  // private toSnakeCase(
  //   data: Partial<CreateDiscountDTO>,
  // ): Record<string, unknown> {
  //   return Object.entries(data).reduce(
  //     (acc, [key, value]) => {
  //       if (value === undefined) return acc;

  //       const snakeKey = this.fieldMap[key] ?? key;
  //       acc[snakeKey] = this.dateFields.has(key)
  //         ? new Date(value as string)
  //         : value;

  //       return acc;
  //     },
  //     {} as Record<string, unknown>,
  //   );
  // }

  private validate(data: CreateDiscountDTO): void {
    if (!data?.type) {
      throw new AppError('Discount type is required', StatusCodes.BAD_REQUEST);
    }

    if (data.type === DiscountType.PERCENTAGE && data.value > 100) {
      throw new AppError(
        'Percentage cannot exceed 100',
        StatusCodes.BAD_REQUEST,
      );
    }

    if (new Date(data.starts_at) >= new Date(data.ends_at)) {
      throw new AppError(
        'End date must be after start date',
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}

export default DiscountService;
