import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../../configs/database';

/* =======================
   Attributes
======================= */
export interface BrandAttributes {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  logo?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/* =======================
   Creation Attributes ✅
======================= */
export type BrandCreationAttributes = Optional<
  BrandAttributes,
  'created_at' | 'id' | 'logo' | 'updated_at'
>;

/* =======================
   Model
======================= */
export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  declare readonly created_at: Date;
  declare id: string;
  declare is_active: boolean;
  declare logo?: string;
  declare name: string;
  declare name_fa: string;
  declare slug: string;
  declare readonly updated_at: Date;
}

Brand.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name_fa: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    logo: {
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
    tableName: 'brands',
    timestamps: true,
    underscored: true,
  },
);

export default Brand;
