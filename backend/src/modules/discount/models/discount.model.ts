import type { Optional } from 'sequelize';

import { DataTypes, Model, Op } from 'sequelize';

import { sequelize } from '../../../configs/database';
import { DiscountType } from '../../../shared/types-enums/enums';

export interface DiscountAttributes {
  id: string;
  name: string;
  coupon_code: string;
  type: DiscountType;
  value: number;
  max_amount?: number;
  starts_at: Date;
  ends_at: Date;
  is_active: boolean;
  badge_text?: string;
}

export interface DiscountCreationAttributes
  extends Optional<
    DiscountAttributes,
    'ends_at' | 'id' | 'is_active' | 'starts_at'
  > {}

export class Discount
  extends Model<DiscountAttributes, DiscountCreationAttributes>
  implements DiscountAttributes
{
  public badge_text?: string;
  public coupon_code!: string;
  public ends_at!: Date;
  public id!: string;
  public is_active!: boolean;
  public max_amount?: number;
  public name!: string;
  public starts_at!: Date;
  public type!: DiscountType;
  public value!: number;

  // آیا تخفیف فعال و معتبر است؟
  get isValid(): boolean {
    const now = new Date();
    return this.is_active && now >= this.starts_at && now <= this.ends_at;
  }

  // یافتن تخفیف فعال برای محصول
  static async findActiveForProduct(): Promise<Discount | null> {
    const now = new Date();
    const baseWhere = {
      is_active: true,
      starts_at: { [Op.lte]: now },
      ends_at: { [Op.gte]: now },
    };

    const discount = await Discount.findOne({
      where: baseWhere,
      order: [['value', 'DESC']],
    });
    if (discount) return discount;

    return discount;
  }

  // محاسبه مقدار تخفیف
  calculate(price: number): number {
    if (!this.isValid) return 0;

    let discountAmount = 0;
    if (this.type === DiscountType.PERCENTAGE) {
      discountAmount = Math.round((price * this.value) / 100);
      if (this.max_amount) {
        discountAmount = Math.min(discountAmount, this.max_amount);
      }
    } else {
      discountAmount = this.value;
    }

    return Math.min(discountAmount, price);
  }
}

Discount.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    coupon_code: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(DiscountType)),
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    max_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    badge_text: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'discounts',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['starts_at', 'ends_at'] }, { fields: ['is_active'] }],
  },
);

export default Discount;
