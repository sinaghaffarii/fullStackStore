import { DataTypes, Model, Op } from 'sequelize';

import { sequelize } from '../../../configs/database';

// ============================================================================
// Attributes Interface
// ============================================================================

interface RefreshTokenAttributes {
  id: string;
  user_id: string;
  token_hash: string;
  device_info?: string;
  ip_address?: string;
  expires_at: Date;
  created_at?: Date;
}

// ============================================================================
// Creation Attributes
// ============================================================================

interface RefreshTokenCreationAttributes
  extends Omit<RefreshTokenAttributes, 'created_at' | 'id'> {
  id?: string;
}

// ============================================================================
// Model Class
// ============================================================================

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare readonly created_at: Date;
  declare device_info?: string;
  declare expires_at: Date;
  declare id: string;
  declare ip_address?: string;
  declare token_hash: string;
  declare user_id: string;

  // ==================== Helper Methods ====================

  static async cleanupExcessTokens(
    userId: string,
    maxTokens: number = 5,
  ): Promise<void> {
    const tokens = await RefreshToken.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    if (tokens.length > maxTokens) {
      const toDelete = tokens.slice(maxTokens);
      await RefreshToken.destroy({
        where: { id: toDelete.map((t) => t.id) },
      });
    }
  }

  // ==================== Static Methods ====================

  static async cleanupExpired(): Promise<number> {
    const result = await RefreshToken.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() },
      },
    });
    return result;
  }

  isExpired(): boolean {
    return new Date() > this.expires_at;
  }
}

// ============================================================================
// Model Initialization
// ============================================================================

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    device_info: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['token_hash'] },
      { fields: ['expires_at'] },
    ],
  },
);

export default RefreshToken;
