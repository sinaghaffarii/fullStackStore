import { StatusCodes } from 'http-status-codes';

import type { SmsService } from '../../infrastructure/external/sms.service';

import { User } from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';
import { generateOtp } from '../../shared/utils/otp';

interface OtpData {
  code: string;
  attempts: number;
  sentAt: number;
}

export class AuthService {
  private otpStore = new Map<string, OtpData>();

  private get cooldown(): number {
    return 60_000; // 1 دقیقه
  }

  private get ttl(): number {
    return 120_000; // 2 دقیقه
  }

  constructor(private smsService: SmsService) {}

  async sendOtp(rawPhone: string): Promise<void> {
    const phone = this.normalizePhone(rawPhone);

    // Rate Limit
    const existing = this.otpStore.get(phone);
    if (existing && Date.now() - existing.sentAt < this.cooldown) {
      throw new AppError(
        'لطفا یک دقیقه صبر کنید',
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }

    const code = generateOtp(5);

    // ارسال پیامک
    const result = await this.smsService.sendOtp(phone, code);

    if (!result.success) {
      throw new AppError(result.message, StatusCodes.SERVICE_UNAVAILABLE);
    }

    // ذخیره
    this.otpStore.set(phone, { code, attempts: 0, sentAt: Date.now() });

    // حذف خودکار بعد از 2 دقیقه
    setTimeout(() => this.otpStore.delete(phone), this.ttl);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[OTP] ${phone}: ${code}`);
    }
  }

  async verifyOtp(rawPhone: string, code: string) {
    const phone = this.normalizePhone(rawPhone);
    const data = this.otpStore.get(phone);

    if (!data) {
      throw new AppError('کد منقضی شده است', StatusCodes.BAD_REQUEST);
    }

    if (data.attempts >= 3) {
      this.otpStore.delete(phone);
      throw new AppError(
        'تعداد تلاش بیش از حد مجاز',
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }

    if (data.code !== code) {
      data.attempts++;
      throw new AppError('کد اشتباه است', StatusCodes.BAD_REQUEST);
    }

    this.otpStore.delete(phone);

    const [user, created] = await User.findOrCreate({
      where: { phone_number: phone },
      defaults: {
        phone_number: phone,
        role: 'customer',
        is_verified: true,
      },
    });

    return { user, isNewUser: created };
  }

  private normalizePhone(phone: string): string {
    let p = phone.replace(/\D/g, '');

    if (p.startsWith('98')) p = `0${p.slice(2)}`;
    if (p.startsWith('9') && p.length === 10) p = `0${p}`;

    if (!/^09\d{9}$/.test(p)) {
      throw new AppError('شماره موبایل نامعتبر است', StatusCodes.BAD_REQUEST);
    }

    return p;
  }
}
