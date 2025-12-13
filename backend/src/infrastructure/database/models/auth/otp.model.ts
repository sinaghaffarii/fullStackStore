import { DataTypes, Model, Op } from 'sequelize';

import { sequelize } from '../../../../configs/database';

// ============================================================================
// Attributes Interface
// ============================================================================

interface OTPAttributes {
  id: string;
  phone_number?: string;
  email?: string;
  code: string;
  attempts: number;
  expires_at: Date;
  used: boolean;
  created_at?: Date;
}

// ============================================================================
// Creation Attributes
// ============================================================================

interface OTPCreationAttributes
  extends Omit<OTPAttributes, 'created_at' | 'id'> {
  id?: string;
}

// ============================================================================
// Model Class
// ============================================================================

export class OTP
  extends Model<OTPAttributes, OTPCreationAttributes>
  implements OTPAttributes
{
  declare attempts: number;
  declare code: string;
  declare readonly created_at: Date;
  declare email?: string;
  declare expires_at: Date;
  declare id: string;
  declare phone_number?: string;
  declare used: boolean;

  // ==================== Helper Methods ====================

  static async cleanupExpired(): Promise<number> {
    const result = await OTP.destroy({
      where: {
        [Op.or]: [{ expires_at: { [Op.lt]: new Date() } }, { used: true }],
      },
    });
    return result;
  }

  static async deleteByEmail(email: string): Promise<number> {
    return OTP.destroy({ where: { email } });
  }

  static async deleteByPhone(phoneNumber: string): Promise<number> {
    return OTP.destroy({ where: { phone_number: phoneNumber } });
  }

  static async findActiveByEmail(email: string): Promise<OTP | null> {
    return OTP.findOne({
      where: {
        email,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['created_at', 'DESC']],
    });
  }

  // ==================== Static Methods ====================

  static async findActiveByPhone(phoneNumber: string): Promise<OTP | null> {
    return OTP.findOne({
      where: {
        phone_number: phoneNumber,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['created_at', 'DESC']],
    });
  }

  canAttempt(maxAttempts: number = 3): boolean {
    return this.attempts < maxAttempts;
  }

  canResend(cooldownSeconds: number = 60): boolean {
    const elapsed = Date.now() - this.created_at.getTime();
    return elapsed >= cooldownSeconds * 1000;
  }

  getResendWaitTime(cooldownSeconds: number = 60): number {
    const elapsed = Date.now() - this.created_at.getTime();
    const remaining = cooldownSeconds * 1000 - elapsed;
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  isExpired(): boolean {
    return new Date() > this.expires_at;
  }
}

// ============================================================================
// Model Initialization
// ============================================================================

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['phone_number'] },
      { fields: ['email'] },
      { fields: ['expires_at'] },
      { fields: ['used'] },
    ],
  },
);

export default OTP;
