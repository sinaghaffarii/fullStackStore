import { DataTypes, Model } from 'sequelize';

import type {
  CategoryAttributes,
  CategoryCreationAttributes,
} from './entities/category.entity';

import { sequelize } from '../../../../configs/database';

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public readonly children?: Category[];
  public readonly created_at!: Date;
  public description?: string;
  public id!: string;
  public image?: string;
  public is_active!: boolean;
  public name!: string;
  // Relations
  public readonly parent?: Category;
  public parent_id?: string;
  public slug!: string;

  public sort_order!: number;
  public readonly updated_at!: Date;
}

Category.init(
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
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['parent_id'] },
      { fields: ['sort_order'] },
    ],
  },
);

export default Category;
export type { CategoryAttributes, CategoryCreationAttributes };
