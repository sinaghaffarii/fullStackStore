import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../../configs/database';

// ==================== Cart ====================
export interface CartAttributes {
  id: string;
  user_id?: string;
  session_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Cart extends Model<CartAttributes> implements CartAttributes {
  public readonly created_at!: Date;
  public id!: string;
  public readonly items?: CartItem[];
  public session_id?: string;
  public readonly updated_at!: Date;

  public user_id?: string;
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    session_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'carts',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['user_id'] }, { fields: ['session_id'] }],
  },
);

// ==================== CartItem ====================
export interface CartItemAttributes {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
}

export class CartItem
  extends Model<CartItemAttributes>
  implements CartItemAttributes
{
  public cart_id!: string;
  public readonly created_at!: Date;
  public id!: string;
  public quantity!: number;
  public readonly updated_at!: Date;
  public readonly variant?: any;

  public variant_id!: string;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cart_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
  },
  {
    sequelize,
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['cart_id'] },
      { fields: ['variant_id'] },
      { fields: ['cart_id', 'variant_id'], unique: true },
    ],
  },
);

export default { Cart, CartItem };
