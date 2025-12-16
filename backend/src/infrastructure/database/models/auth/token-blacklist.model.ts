import { DataTypes, Model, Op } from 'sequelize';

import { sequelize } from '../../../../configs/database';

// ============================================================================
// Attributes Interface
// ============================================================================

interface TokenBlacklistAttributes {
  id: string;
  token_hash: string;
  token_type: 'access' | 'refresh';
  expires_at: Date;
  created_at?: Date;
}

// ============================================================================
// Creation Attributes
// ============================================================================

interface TokenBlacklistCreationAttributes
  extends Omit<TokenBlacklistAttributes, 'created_at' | 'id'> {
  id?: string;
}

// ============================================================================
// Model Class
// ============================================================================

export class TokenBlacklist
  extends Model<TokenBlacklistAttributes, TokenBlacklistCreationAttributes>
  implements TokenBlacklistAttributes
{
  declare readonly created_at: Date;
  declare expires_at: Date;
  declare id: string;
  declare token_hash: string;
  declare token_type: 'access' | 'refresh';

  // ==================== Static Methods ====================

  static async cleanupExpired(): Promise<number> {
    const result = await TokenBlacklist.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() },
      },
    });
    return result;
  }

  static async isBlacklisted(tokenHash: string): Promise<boolean> {
    const found = await TokenBlacklist.findOne({
      where: {
        token_hash: tokenHash,
        expires_at: { [Op.gt]: new Date() },
      },
    });
    return !!found;
  }
}

// ============================================================================
// Model Initialization
// ============================================================================

TokenBlacklist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token_hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    token_type: {
      type: DataTypes.ENUM('access', 'refresh'),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TokenBlacklist',
    tableName: 'token_blacklist',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['token_hash'], unique: true },
      { fields: ['expires_at'] },
    ],
  },
);

export default TokenBlacklist;
