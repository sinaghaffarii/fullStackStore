import { DataTypes, Model } from 'sequelize';

import type { Product } from './product.model';
import type { User } from './user.model';

import { sequelize } from '../../../configs/database';

interface CartAttributes {
  id: string;
  user_id: string;
  is_active: boolean;
}

class Cart extends Model<CartAttributes> implements CartAttributes {
  public id!: string;
  public is_active!: boolean;
  public readonly items?: CartItem[];

  // Associations
  public readonly user?: User;
  public user_id!: string;

  static associate(models: any): void {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'items',
    });
  }
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
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
  },
);

interface CartItemAttributes {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  attributes: Record<string, any>;
}

class CartItem extends Model<CartItemAttributes> implements CartItemAttributes {
  public attributes!: Record<string, any>;
  // Associations
  public readonly cart?: Cart;
  public cart_id!: string;
  public id!: string;
  public readonly product?: Product;
  public product_id!: string;

  public quantity!: number;
  public unit_price!: number;

  static associate(models: any): void {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'cart',
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
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
      references: {
        model: 'carts',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    attributes: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true,
  },
);

export { Cart, CartItem };
