// src/infrastructure/external/sms.service.ts
import axios from 'axios';

import {
  SmsResponseCode,
  SmsResponseMessages,
} from '../../shared/types-enums/SmsTypes';

export interface SmsResult {
  success: boolean;
  recId?: string;
  code: number;
  message: string;
}

export class SmsService {
  private get baseUrl(): string {
    return 'https://rest.payamak-panel.com/api/SendSMS';
  }

  async sendOtp(phone: string, code: string): Promise<SmsResult> {
    // ✅ در Development فقط لاگ کن
    if (process.env.NODE_ENV === 'development') {
      console.log('═══════════════════════════════════════');
      console.log(`📱 [DEV] OTP for ${phone}: ${code}`);
      console.log('═══════════════════════════════════════');
      return {
        success: true,
        code: 1,
        message: 'OTP logged (dev mode)',
      };
    }

    // ✅ چک تنظیمات
    if (
      !process.env.MELIPAYAMAK_USERNAME ||
      !process.env.MELIPAYAMAK_PASSWORD ||
      !process.env.MELIPAYAMAK_FROM
    ) {
      console.error('[SMS] ❌ Missing credentials in .env');
      return {
        success: false,
        code: -2,
        message: 'تنظیمات سرویس پیامک ناقص است',
      };
    }

    try {
      const message = `کد تایید شما: ${code}\nاین کد تا 2 دقیقه اعتبار دارد.`;

      console.log('[SMS] Sending to:', phone);

      const response = await axios.post(
        `${this.baseUrl}/SendSMS`,
        {
          username: process.env.MELIPAYAMAK_USERNAME,
          password: process.env.MELIPAYAMAK_PASSWORD,
          to: phone,
          from: process.env.MELIPAYAMAK_FROM,
          text: message,
          isflash: false,
        },
        {
          timeout: 15000, // ✅ 15 ثانیه timeout
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { Value, RetStatus } = response.data;
      const retStatus = parseInt(RetStatus, 10);
      const value = parseInt(Value, 10);

      console.log('[SMS] Response:', { RetStatus: retStatus, Value: value });

      if (retStatus === SmsResponseCode.Success && value > 0) {
        return {
          success: true,
          recId: Value,
          code: retStatus,
          message: SmsResponseMessages[retStatus] || 'ارسال موفق',
        };
      }

      const errorCode = retStatus !== 1 ? retStatus : value;
      console.error('[SMS] ❌ Failed:', errorCode);

      return {
        success: false,
        code: errorCode,
        message:
          SmsResponseMessages[errorCode] || `خطای ناشناخته: ${errorCode}`,
      };
    } catch (error) {
      console.error('[SMS] ❌ Error:', error);

      // ✅ بهتر handle کردن خطاها
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            code: -3,
            message: 'تایم‌اوت در ارتباط با سرویس پیامک',
          };
        }
        if (error.response) {
          return {
            success: false,
            code: error.response.status,
            message: `خطای سرور پیامک: ${error.response.status}`,
          };
        }
      }

      return {
        success: false,
        code: -1,
        message: 'خطا در برقراری ارتباط با سرویس پیامک',
      };
    }
  }
}
