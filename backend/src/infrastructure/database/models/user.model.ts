import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../configs/database';
import { OTP } from './otp.model';
import { Cart } from './cart.model';

interface UserAttributes {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  is_verified: boolean;
  refresh_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'role' | 'is_verified' | 'created_at' | 'updated_at'
  > {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare role: 'customer' | 'admin';
  declare is_verified: boolean;
  declare refresh_token?: string;
  declare readonly created_at?: Date;
  declare readonly updated_at?: Date;

  // Associations
  public readonly otps?: OTP[];
  public readonly carts?: Cart[];

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
