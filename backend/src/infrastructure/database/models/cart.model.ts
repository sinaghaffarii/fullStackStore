import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../configs/database';
import { User } from './user.model';
import { Product } from './product.model';

interface CartAttributes {
  id: string;
  user_id: string;
  is_active: boolean;
}

class Cart extends Model<CartAttributes> implements CartAttributes {
  public id!: string;
  public user_id!: string;
  public is_active!: boolean;

  // Associations
  public readonly user?: User;
  public readonly items?: CartItem[];

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
  public id!: string;
  public cart_id!: string;
  public product_id!: string;
  public quantity!: number;
  public unit_price!: number;
  public attributes!: Record<string, any>;

  // Associations
  public readonly cart?: Cart;
  public readonly product?: Product;

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
