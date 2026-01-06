import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../../../configs/database';

export interface ProductImageAttributes {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: Date;
}

export type ProductImageCreationAttributes = Optional<
  ProductImageAttributes,
  'alt' | 'created_at' | 'id' | 'is_primary' | 'sort_order'
>;

export class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public alt?: string;
  public readonly created_at!: Date;
  public id!: string;
  public is_primary!: boolean;
  public product_id!: string;
  public sort_order!: number;
  public url!: string;
}

ProductImage.init(
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
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    alt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'product_images',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    createdAt: 'created_at',
    indexes: [{ fields: ['product_id'] }, { fields: ['is_primary'] }],
  },
);

export default ProductImage;
