import { OTP } from '../../infrastructure/database/models/otp.model';
import { Op } from 'sequelize';
import { generateOtp } from '../../shared/utils/otp';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../infrastructure/database/models/user.model';
import { AppError } from '../../shared/errors/app-error';
import { EmailService } from '../../infrastructure/external/email.service';
import { generateAccessToken } from '../../shared/utils/jwt';

interface VerifyOTPResult {
  user: any;
  token: string;
}

export class AuthService {
  constructor(private emailService: EmailService) {}

  async sendOTP(email: string): Promise<void> {
    await OTP.destroy({
      where: {
        expires_at: { [Op.lt]: new Date() },
      },
    });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await OTP.upsert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    });

    await this.emailService.sendOTP(email, code);
  }

  async verifyOTP(email: string, code: string): Promise<VerifyOTPResult> {
    const otpRecord = await OTP.findOne({
      where: {
        email,
        code,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      throw new AppError('Invalid or Expired OTP', StatusCodes.BAD_REQUEST);
    }

    await otpRecord.update({ used: true });

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email, is_verified: true });
    } else {
      await user.update({ is_verified: true });
    }

    const token = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified,
      },
      token,
    };
  }
}
