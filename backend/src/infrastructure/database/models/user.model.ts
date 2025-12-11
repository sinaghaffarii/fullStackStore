import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../../configs/database';

// ============================================================================
// Attributes Interface
// ============================================================================

export interface UserAttributes {
  id: string;
  username?: string;
  email?: string;
  phone_number?: string;
  password?: string | null;
  role: 'admin' | 'customer';
  is_verified: boolean;
  refresh_token?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// Creation Attributes
// ============================================================================

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'created_at'
    | 'email'
    | 'id'
    | 'is_verified'
    | 'password'
    | 'phone_number'
    | 'refresh_token'
    | 'role'
    | 'updated_at'
    | 'username'
  > {}

// ============================================================================
// Model Class
// ============================================================================

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare readonly created_at: Date;
  declare email?: string;
  declare id: string;
  declare is_verified: boolean;
  declare password?: string | null;
  declare phone_number?: string;
  declare refresh_token?: string | null;
  declare role: 'admin' | 'customer';
  declare readonly updated_at: Date;
  declare username?: string;

  // ==================== Helper Methods ====================

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isCustomer(): boolean {
    return this.role === 'customer';
  }

  toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phoneNumber: this.phone_number,
      role: this.role,
      isVerified: this.is_verified,
      createdAt: this.created_at,
    };
  }
}

// ============================================================================
// Model Initialization
// ============================================================================

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: { isEmail: true },
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
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
    indexes: [
      { fields: ['phone_number'] },
      { fields: ['email'] },
      { fields: ['username'] },
      { fields: ['role'] },
    ],
  },
);

export default User;
