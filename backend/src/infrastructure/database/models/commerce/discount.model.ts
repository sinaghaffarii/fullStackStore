import { DataTypes, Model, Op } from 'sequelize';

import { sequelize } from '../../../../configs/database';
import { DiscountScope, DiscountType } from '../shared';

export interface DiscountAttributes {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  max_amount?: number;
  scope: DiscountScope;
  target_id?: string; // product_id, category_id, or brand_id
  starts_at: Date;
  ends_at: Date;
  is_active: boolean;
  badge_text?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DiscountCreationAttributes
  extends Omit<
    DiscountAttributes,
    'created_at' | 'id' | 'is_active' | 'updated_at'
  > {
  is_active?: boolean;
}

export class Discount
  extends Model<DiscountAttributes, DiscountCreationAttributes>
  implements DiscountAttributes
{
  public badge_text?: string;
  public readonly created_at!: Date;
  public ends_at!: Date;
  public id!: string;
  public is_active!: boolean;
  public max_amount?: number;
  public name!: string;
  public scope!: DiscountScope;
  public starts_at!: Date;
  public target_id?: string;
  public type!: DiscountType;
  public readonly updated_at!: Date;
  public value!: number;

  // آیا تخفیف فعال و معتبر است؟
  get isValid(): boolean {
    const now = new Date();
    return this.is_active && now >= this.starts_at && now <= this.ends_at;
  }

  // یافتن تخفیف فعال برای محصول
  static async findActiveForProduct(
    productId: string,
    categoryId: string,
    brandId?: string,
  ): Promise<Discount | null> {
    const now = new Date();
    const baseWhere = {
      is_active: true,
      starts_at: { [Op.lte]: now },
      ends_at: { [Op.gte]: now },
    };

    // اول تخفیف محصول
    let discount = await Discount.findOne({
      where: {
        ...baseWhere,
        scope: DiscountScope.PRODUCT,
        target_id: productId,
      },
      order: [['value', 'DESC']],
    });
    if (discount) return discount;

    // بعد تخفیف دسته‌بندی
    discount = await Discount.findOne({
      where: {
        ...baseWhere,
        scope: DiscountScope.CATEGORY,
        target_id: categoryId,
      },
      order: [['value', 'DESC']],
    });
    if (discount) return discount;

    // بعد تخفیف برند
    if (brandId) {
      discount = await Discount.findOne({
        where: { ...baseWhere, scope: DiscountScope.BRAND, target_id: brandId },
        order: [['value', 'DESC']],
      });
    }

    return discount;
  }

  // محاسبه مقدار تخفیف
  calculate(price: number): number {
    if (!this.isValid) return 0;

    let discount = 0;
    if (this.type === DiscountType.PERCENTAGE) {
      discount = Math.round((price * this.value) / 100);
      if (this.max_amount) {
        discount = Math.min(discount, this.max_amount);
      }
    } else {
      discount = this.value;
    }

    return Math.min(discount, price);
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
    scope: {
      type: DataTypes.ENUM(...Object.values(DiscountScope)),
      allowNull: false,
    },
    target_id: {
      type: DataTypes.UUID,
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
    indexes: [
      { fields: ['scope', 'target_id'] },
      { fields: ['starts_at', 'ends_at'] },
      { fields: ['is_active'] },
    ],
  },
);

export default Discount;
