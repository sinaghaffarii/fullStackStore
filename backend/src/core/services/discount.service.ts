import type { WhereOptions } from 'sequelize';

import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type {
  DiscountAttributes,
  DiscountScope,
} from '../../infrastructure/database/models';

import { Discount, DiscountType } from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';

export interface CreateDiscountDTO {
  name: string;
  type: DiscountType;
  value: number;
  scope: DiscountScope;
  startsAt: Date;
  endsAt: Date;
  maxAmount?: number;
  targetId?: string;
  badgeText?: string;
  isActive?: boolean;
}

export interface DiscountFilters {
  scope?: DiscountScope;
  isActive?: boolean;
  validOnly?: boolean;
  page?: number;
  limit?: number;
}

export class DiscountService {
  private readonly dateFields = new Set(['endsAt', 'startsAt']);

  private readonly fieldMap: Record<string, string> = {
    maxAmount: 'max_amount',
    targetId: 'target_id',
    startsAt: 'starts_at',
    endsAt: 'ends_at',
    badgeText: 'badge_text',
    isActive: 'is_active',
  };

  async create(data: CreateDiscountDTO): Promise<Discount> {
    this.validate(data);
    return Discount.create(this.toSnakeCase(data) as any);
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

  async list(filters: DiscountFilters = {}) {
    const { page = 1, limit = 20, scope, isActive, validOnly } = filters;
    const where: WhereOptions<DiscountAttributes> = {};

    if (scope) where.scope = scope;
    if (isActive !== undefined) where.is_active = isActive;

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

    return { discounts: rows, total: count };
  }

  async toggleActive(id: string): Promise<Discount> {
    const discount = await this.getById(id);
    await discount.update({ is_active: !discount.is_active });
    return discount;
  }

  async update(
    id: string,
    data: Partial<CreateDiscountDTO>,
  ): Promise<Discount> {
    const discount = await this.getById(id);
    await discount.update(this.toSnakeCase(data));
    return discount;
  }

  private toSnakeCase(
    data: Partial<CreateDiscountDTO>,
  ): Record<string, unknown> {
    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (value === undefined) return acc;

        const snakeKey = this.fieldMap[key] ?? key;
        acc[snakeKey] = this.dateFields.has(key)
          ? new Date(value as string)
          : value;

        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

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

    if (new Date(data.startsAt) >= new Date(data.endsAt)) {
      throw new AppError(
        'End date must be after start date',
        StatusCodes.BAD_REQUEST,
      );
    }
  }
}
