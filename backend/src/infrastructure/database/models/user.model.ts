import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import type { Cart } from './cart.model';
import type { OTP } from './otp.model';

import { sequelize } from '../../../configs/database';

interface UserAttributes {
  id: string;
  email: string;
  password?: string | null;
  role: 'admin' | 'customer';
  is_verified: boolean;
  refresh_token?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'created_at' | 'id' | 'is_verified' | 'password' | 'role' | 'updated_at'
  > {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public readonly carts?: Cart[];
  declare readonly created_at?: Date;
  declare email: string;
  declare id: string;
  declare is_verified: boolean;
  // Associations
  public readonly otps?: OTP[];
  declare password?: string;
  declare refresh_token?: string;

  declare role: 'admin' | 'customer';
  declare readonly updated_at?: Date;

  static associate(models: any): void {
    User.hasMany(models.OTP, {
      foreignKey: 'email',
      sourceKey: 'email',
      as: 'otps',
    });

    User.hasMany(models.Cart, {
      foreignKey: 'user_id',
      as: 'carts',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer',
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default User;
