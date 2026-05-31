import { DataTypes, Model } from 'sequelize';

import type { StockStatus } from '../../../shared/types-enums/enums';
import type {
  ProductVariantAttributes,
  ProductVariantCreationAttributes,
  VariantOption,
} from './entities/variant.entity';

import { sequelize } from '../../../configs/database';
import { getStockStatus } from '../../../shared/types-enums/enums';

export class ProductVariant
  extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  public compare_price?: number;
  public readonly created_at!: Date;
  public id!: string;
  public image_url?: string;
  public is_active!: boolean;
  public name!: string;
  public options!: VariantOption[];
  public price!: number;
  public product_id!: string;
  public sku!: string;
  public stock!: number;
  public readonly updated_at!: Date;

  get discountPercent(): number {
    if (!this.compare_price || this.compare_price <= this.price) return 0;
    return Math.round(
      ((this.compare_price - this.price) / this.compare_price) * 100,
    );
  }

  // Computed
  get stockStatus(): StockStatus {
    return getStockStatus(this.stock);
  }
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    compare_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['product_id'] },
      { fields: ['sku'], unique: true },
      { fields: ['stock'] },
      { fields: ['is_active'] },
    ],
  },
);

export default ProductVariant;
export type {
  ProductVariantAttributes,
  ProductVariantCreationAttributes,
  VariantOption,
};
