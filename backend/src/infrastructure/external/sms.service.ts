import axios from 'axios';

import {
  SmsResponseCode,
  SmsResponseMessages,
} from '../../shared/types/SmsTypes';

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
    try {
      const message = `کد تایید شما: ${code}\nاین کد تا 2 دقیقه اعتبار دارد.`;

      console.log('[SMS] Sending to:', phone);

      const response = await axios.post(`${this.baseUrl}/SendSMS`, {
        username: process.env.MELIPAYAMAK_USERNAME,
        password: process.env.MELIPAYAMAK_PASSWORD,
        to: phone,
        from: process.env.MELIPAYAMAK_FROM,
        text: message,
        isflash: false,
      });

      const { Value, RetStatus } = response.data;
      const retStatus = parseInt(RetStatus, 10);
      const value = parseInt(Value, 10);

      console.log('[SMS] Response:', response.data);

      if (retStatus === SmsResponseCode.Success && value > 0) {
        return {
          success: true,
          recId: Value,
          code: retStatus,
          message: SmsResponseMessages[retStatus],
        };
      }

      const errorCode = retStatus !== 1 ? retStatus : value;
      return {
        success: false,
        code: errorCode,
        message:
          SmsResponseMessages[errorCode] || `خطای ناشناخته: ${errorCode}`,
      };
    } catch (error) {
      console.error('[SMS] Error:', error);
      return {
        success: false,
        code: -1,
        message: 'خطا در برقراری ارتباط با سرویس پیامک',
      };
    }
  }
}
