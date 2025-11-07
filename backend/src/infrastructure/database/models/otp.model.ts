import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../configs/database';
import { User } from './user.model';

interface OTPAttributes {
  id?: string;
  email: string;
  code: string;
  expires_at: Date;
  used: boolean;
}

export class OTP extends Model<OTPAttributes> implements OTPAttributes {
  declare id?: string;
  declare email: string;
  declare code: string;
  declare expires_at: Date;
  declare used: boolean;

  // Associations
  public readonly user?: User;

  static associate(models: any): void {
    OTP.belongsTo(models.User, {
      foreignKey: 'email',
      targetKey: 'email',
      as: 'user',
    });
  }
}

OTP.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: true,
  },
);

export default OTP;
