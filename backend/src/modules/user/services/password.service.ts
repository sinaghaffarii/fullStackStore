import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { EmailService } from '../../../external/email.service';

import { AppError } from '../../../shared/errors/app-error';
import {
  generateAccessToken,
  verifyAccessToken,
} from '../../../shared/utils/jwt';
import { generateOtp } from '../../../shared/utils/otp';
import OTP from '../models/otp.model';
import User from '../models/user.model';

export class PasswordService {
  constructor(private emailService: EmailService) {}

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    if (!user.password) {
      throw new AppError(
        'Password not set for this account',
        StatusCodes.BAD_REQUEST,
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new AppError(
        'Current password is incorrect',
        StatusCodes.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.update({
      password: hashedPassword,
      refresh_token: null,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return;
    }

    await OTP.destroy({
      where: {
        email,
        expires_at: { [Op.lt]: new Date() },
      },
    });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await OTP.upsert({
      email,
      code,
      attempts: 0,
      expires_at: expiresAt,
      used: false,
    });

    await this.emailService.sendPasswordResetOTP(email, code);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    try {
      const decoded = verifyAccessToken(resetToken) as { email: string };

      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await user.update({
        password: hashedPassword,
        refresh_token: null,
      });
    } catch (_error) {
      throw new AppError(
        'Invalid or expired reset token',
        StatusCodes.UNAUTHORIZED,
      );
    }
  }

  async verifyPasswordResetOTP(
    email: string,
    code: string,
  ): Promise<{ resetToken: string }> {
    const otpRecord = await OTP.findOne({
      where: {
        email,
        code,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      throw new AppError('Invalid or expired OTP', StatusCodes.BAD_REQUEST);
    }

    await otpRecord.update({ used: true });

    const resetToken = generateAccessToken({
      userId: '',
      email,
      role: 'password_reset',
    });

    return { resetToken };
  }
}
