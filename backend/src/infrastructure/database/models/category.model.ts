import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import type { Product } from './product.model';

import { sequelize } from '../../../configs/database';

export interface CategoryAttributes {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'description' | 'id' | 'parent_id'> {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public readonly children?: Category[];
  public description?: string;
  public id!: string;
  public name!: string;

  public readonly parent?: Category;
  public parent_id?: string;
  public readonly products?: Product[];

  static associate(models: any): void {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parent',
    });

    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'children',
    });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  },
);

export default Category;
