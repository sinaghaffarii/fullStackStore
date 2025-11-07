import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import type { CartItem } from './cart.model';
import type { Category } from './category.model';

import { sequelize } from '../../../configs/database';

export interface ProductAttributes {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category_id: string;
  attributes: Record<string, any>;
  stock_quantity: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    'created_at' | 'description' | 'id' | 'is_active' | 'updated_at'
  > {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public attributes!: Record<string, any>;
  public base_price!: number;
  public readonly cart_items?: CartItem[];
  // Associations
  public readonly category?: Category;
  public category_id!: string;
  public readonly created_at!: Date;
  public description?: string;
  public id!: string;
  public is_active!: boolean;
  public name!: string;

  public stock_quantity!: number;
  public readonly updated_at!: Date;

  static associate(models: any): void {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });

    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      as: 'cart_items',
    });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    attributes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      validate: {
        isObject(value: any) {
          if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
          ) {
            throw new Error('Attributes must be an object');
          }
        },
      },
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Product;
