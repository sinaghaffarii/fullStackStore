import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../configs/database';

interface OTPAttributes {
  id?: string;
  email: string;
  code: string;
  expires_at: Date;
  used: boolean;
}

export class OTP extends Model<OTPAttributes> implements OTPAttributes {
  public id?: string;
  public email!: string;
  public code!: string;
  public expires_at!: Date;
  public used!: boolean;
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
