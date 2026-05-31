import axios from 'axios';

export interface SmsResult {
  status: boolean;
  code?: string; // OTP واقعی
  message: string;
}

export class SmsService {
  private get apiKey(): string | undefined {
    return process.env.MELIPAYAMAK_OTP_API_KEY;
  }

  private get otpUrl(): string {
    return 'https://console.melipayamak.com/api/send/otp';
  }

  async sendOtp(phone: string): Promise<SmsResult> {
    // ✅ Development: فقط لاگ
    if (process.env.NODE_ENV === 'development') {
      const fakeOtp = Math.floor(10000 + Math.random() * 90000).toString();
      console.log('═══════════════════════════════════════');
      console.log(`📱 [DEV] OTP for ${phone}: ${fakeOtp}`);
      console.log('═══════════════════════════════════════');
      return {
        status: true,
        code: fakeOtp,
        message: 'OTP logged (dev mode)',
      };
    }

    if (!this.apiKey) {
      return {
        status: false,
        message: 'کلید API سرویس پیامک تنظیم نشده است',
      };
    }

    try {
      const response = await axios.post(
        `${this.otpUrl}/${this.apiKey}`,
        { to: phone },
        {
          timeout: 15000,
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const { code, status } = response.data as {
        code: string;
        status?: string;
      };

      if (!code) {
        return {
          status: false,
          message: status || 'خطا در ارسال پیامک',
        };
      }

      return {
        status: true,
        code,
        message: 'کد تایید ارسال شد',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            status: false,
            message: 'تایم‌اوت در ارتباط با سرویس پیامک',
          };
        }
        if (error.response) {
          return {
            status: false,
            message: `خطای سرویس پیامک: ${error.response.status}`,
          };
        }
      }

      return {
        status: false,
        message: 'خطا در اتصال به سرویس پیامک',
      };
    }
  }
}
