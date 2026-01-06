import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../../../configs/database';
import { ProductStatus } from '../shared';

export interface ProductAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  category_id: string;
  brand_id?: string;
  tags: string[];
  specifications: Record<string, string>;
  view_count: number;
  sales_count: number;
  rating: number;
  review_count: number;
  status: ProductStatus;
  is_featured: boolean;
  is_new: boolean;
  created_at: Date;
  updated_at: Date;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  | 'brand_id'
  | 'created_at'
  | 'description'
  | 'id'
  | 'is_featured'
  | 'is_new'
  | 'rating'
  | 'review_count'
  | 'sales_count'
  | 'specifications'
  | 'status'
  | 'tags'
  | 'updated_at'
  | 'view_count'
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public base_price!: number;
  public readonly brand?: any;
  public brand_id?: string;
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
      type: DataTypes.BIGINT,
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
