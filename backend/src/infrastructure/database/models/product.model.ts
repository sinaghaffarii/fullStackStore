import { DataTypes, Model, Optional } from 'sequelize';
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

// برای ایجاد محصول - فیلدهای optional رو مشخص می‌کنیم
export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    'id' | 'description' | 'is_active' | 'created_at' | 'updated_at'
  > {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public base_price!: number;
  public category_id!: string;
  public attributes!: Record<string, any>;
  public stock_quantity!: number;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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
