import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { EmailService } from '../../infrastructure/external/email.service';

import { OTP } from '../../infrastructure/database/models/otp.model';
import { User } from '../../infrastructure/database/models/user.model';
import { AppError } from '../../shared/errors/app-error';
import { generateAccessToken, verifyAccessToken } from '../../shared/utils/jwt';
import { generateOtp } from '../../shared/utils/otp';

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

    // Check if user has a password set
    if (!user.password) {
      throw new AppError(
        'Password not set for this account',
        StatusCodes.BAD_REQUEST,
      );
    }

    // Verify current password
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and invalidate all sessions
    await user.update({
      password: hashedPassword,
      refresh_token: null,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return;
    }

    // Clean up expired OTPs
    await OTP.destroy({
      where: {
        email,
        expires_at: { [Op.lt]: new Date() },
      },
    });

    // Generate OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await OTP.upsert({
      email,
      code,
      expires_at: expiresAt,
      used: false,
    });

    // Send email
    await this.emailService.sendPasswordResetOTP(email, code);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    try {
      // Verify the reset token
      const decoded = verifyAccessToken(resetToken) as { email: string };

      // Find user
      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and invalidate all sessions
      await user.update({
        password: hashedPassword,
        refresh_token: null,
      });
    } catch (error) {
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

    // Mark OTP as used
    await otpRecord.update({ used: true });

    // Create reset token (valid for 15 minutes)
    const resetToken = generateAccessToken({
      userId: '', // will be filled after verification
      email,
      role: 'password_reset',
    });

    return { resetToken };
  }
}
