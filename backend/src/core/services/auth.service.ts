import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import type { SmsService } from '../../infrastructure/external/sms.service';

import { OTP, User } from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';
import { generateOtp } from '../../shared/utils/otp';

export class AuthService {
  // ==================== Config ====================

  private get maxOtpAttempts(): number {
    return 3;
  }

  private get otpCooldownSeconds(): number {
    return 60;
  }

  private get otpTtlSeconds(): number {
    return 120;
  }

  constructor(private smsService: SmsService) {}

  // ==================== Send OTP ====================

  async adminLogin(username: string, password: string): Promise<User> {
    const user = await User.findOne({
      where: {
        username,
        role: 'admin',
      },
    });

    if (!user) {
      throw new AppError('نام کاربری یا رمز عبور اشتباه است', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    if (!user.password) {
      throw new AppError('حساب کاربری معتبر نیست', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('نام کاربری یا رمز عبور اشتباه است', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    return user;
  }

  // ==================== Verify OTP ====================

  async getAdminById(userId: string): Promise<User | null> {
    return User.findOne({
      where: {
        id: userId,
        role: 'admin',
      },
      attributes: [
        'id',
        'username',
        'email',
        'role',
        'created_at',
        'updated_at',
      ],
    });
  }

  // ==================== Admin Login ====================

  async getUserById(userId: string): Promise<User | null> {
    return User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'phone_number',
        'role',
        'is_verified',
        'created_at',
      ],
    });
  }

  // ==================== Get User ====================

  async sendOtp(rawPhone: string): Promise<void> {
    const phone = this.normalizePhone(rawPhone);

    const existingOtp = await OTP.findActiveByPhone(phone);
    if (existingOtp && !existingOtp.canResend(this.otpCooldownSeconds)) {
      const waitTime = existingOtp.getResendWaitTime(this.otpCooldownSeconds);
      throw new AppError(`لطفاً ${waitTime} ثانیه صبر کنید`, {
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
      });
    }

    await OTP.deleteByPhone(phone);

    const result = await this.smsService.sendOtp(phone);

    if (!result.success || !result.code) {
      throw new AppError(result.message || 'خطا در ارسال پیامک', {
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
      });
    }

    await OTP.create({
      phone_number: phone,
      code: result.code,
      attempts: 0,
      used: false,
      expires_at: new Date(Date.now() + this.otpTtlSeconds * 1000),
    });
  }

  async verifyOtp(
    rawPhone: string,
    code: string,
  ): Promise<{ user: User; isNewUser: boolean }> {
    const phone = this.normalizePhone(rawPhone);

    const otp = await OTP.findActiveByPhone(phone);

    if (!otp) {
      throw new AppError(
        'کد تأیید یافت نشد یا منقضی شده. لطفاً دوباره درخواست دهید',
        { statusCode: StatusCodes.BAD_REQUEST },
      );
    }

    if (otp.isExpired()) {
      await otp.destroy();
      throw new AppError('کد تأیید منقضی شده است', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!otp.canAttempt(this.maxOtpAttempts)) {
      await otp.destroy();
      throw new AppError(
        'تعداد تلاش بیش از حد مجاز. لطفاً کد جدید دریافت کنید',
        { statusCode: StatusCodes.TOO_MANY_REQUESTS },
      );
    }

    if (otp.code !== code) {
      otp.attempts += 1;
      await otp.save();

      const remaining = this.maxOtpAttempts - otp.attempts;

      if (remaining <= 0) {
        await otp.destroy();
        throw new AppError('کد اشتباه است. لطفاً کد جدید دریافت کنید', {
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      throw new AppError(`کد اشتباه است. ${remaining} تلاش باقی مانده`, {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    otp.used = true;
    await otp.save();

    const [user, created] = await User.findOrCreate({
      where: { phone_number: phone },
      defaults: {
        phone_number: phone,
        role: 'customer',
        is_verified: true,
      },
    });

    if (!created && !user.is_verified) {
      user.is_verified = true;
      await user.save();
    }

    return { user, isNewUser: created };
  }

  // ==================== Normalize Phone ====================

  private normalizePhone(phone: string): string {
    let p = phone.replace(/\D/g, '');

    if (p.startsWith('98')) {
      p = `0${p.slice(2)}`;
    } else if (p.startsWith('9') && p.length === 10) {
      p = `0${p}`;
    }

    if (!/^09\d{9}$/.test(p)) {
      throw new AppError('شماره موبایل نامعتبر است', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    return p;
  }
}
