import { DataTypes, Model } from 'sequelize';

import type {
  ProductAttributes,
  ProductCreationAttributes,
} from './entities/product.entity';

import { sequelize } from '../../../../configs/database';
import { ProductStatus } from '../shared';

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public base_price!: number;
  public readonly brand?: any;
  public brand_id?: string;
  // Relations (populated by associations)
  public readonly category?: any;
  public category_id!: string;
  public readonly created_at!: Date;
  public description?: string;
  public id!: string;
  public readonly images?: any[];
  public is_featured!: boolean;
  public is_new!: boolean;
  public name!: string;
  public rating!: number;
  public review_count!: number;
  public sales_count!: number;
  public slug!: string;
  public specifications!: Record<string, string>;
  public status!: ProductStatus;

  public tags!: string[];
  public readonly updated_at!: Date;
  public readonly variants?: any[];
  public view_count!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(280),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    base_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    brand_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    specifications: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sales_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ProductStatus)),
      defaultValue: ProductStatus.DRAFT,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['category_id'] },
      { fields: ['brand_id'] },
      { fields: ['status'] },
      { fields: ['base_price'] },
      { fields: ['sales_count'] },
      { fields: ['is_featured'] },
    ],
  },
);

export default Product;
export type { ProductAttributes, ProductCreationAttributes };
