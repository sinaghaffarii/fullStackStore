import type { Optional } from 'sequelize';

import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../../../configs/database';
import { Role } from '../../../../shared/types-enums/role.enum';

// ============================================================================
// Attributes Interface
// ============================================================================

export interface UserAttributes {
  id: string;
  username?: string;
  email?: string;
  phone_number?: string;
  password?: string | null;
  role: Role;
  is_active: boolean;
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
    | 'is_active'
    | 'is_verified'
    | 'password'
    | 'phone_number'
    | 'refresh_token'
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
  declare is_active: boolean;
  declare is_verified: boolean;
  declare password?: string | null;
  declare phone_number?: string;
  declare refresh_token?: string | null;
  declare role: Role;
  declare readonly updated_at: Date;
  declare username?: string;

  // ==================== Helper Methods ====================

  canAccessDashboard(): boolean {
    return this.isAdmin();
  }

  canManageAdmins(): boolean {
    return this.isSuperAdmin();
  }

  isAdmin(): boolean {
    return this.role === Role.Admin || this.role === Role.SuperAdmin;
  }

  isCustomer(): boolean {
    return this.role === Role.Customer;
  }

  isSuperAdmin(): boolean {
    return this.role === Role.SuperAdmin;
  }

  toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phoneNumber: this.phone_number,
      role: this.role,
      isActive: this.is_active,
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
      type: DataTypes.ENUM(Role.Customer, Role.Admin, Role.SuperAdmin),
      defaultValue: Role.Customer,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
      { fields: ['is_active'] },
    ],
  },
);

export default User;
