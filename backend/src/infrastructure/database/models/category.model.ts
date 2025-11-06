import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../configs/database';

interface CategoryAttributes {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
}

export class Category
  extends Model<CategoryAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public parent_id?: string;
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
