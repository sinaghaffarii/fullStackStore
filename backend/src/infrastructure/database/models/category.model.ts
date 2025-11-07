import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../configs/database';
import { Product } from './product.model';

export interface CategoryAttributes {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id' | 'description' | 'parent_id'> {}

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public parent_id?: string;

  public readonly products?: Product[];
  public readonly parent?: Category;
  public readonly children?: Category[];

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
