import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../../../core/services/auth.service';
import { AppError } from '../../../shared/errors/app-error';
import { sendResponse } from '../../../shared/utils/response-handler';
import {
  clearAuthCookies,
  setAccessTokenCookie,
} from '../../../shared/utils/jwt';

export class AuthController {
  constructor(private authService: AuthService) {}

  sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email)
        throw new AppError(
          'Email address is required',
          StatusCodes.BAD_REQUEST,
        );

      await this.authService.sendOTP(email);

      sendResponse(res, StatusCodes.OK, {
        message: 'OTP send successfully',
        data: { email },
      });
    } catch (err) {
      throw err;
    }
  };

  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, code } = req.body;
      if (!email || !code)
        throw new AppError(
          'email and otp code is required',
          StatusCodes.BAD_REQUEST,
        );

      const result = await this.authService.verifyOTP(email, code);

      setAccessTokenCookie(res, result.token);

      sendResponse(res, StatusCodes.OK, {
        message: 'OTP verified successfully',
        data: {
          user: result.user,
        },
      });
    } catch (err) {
      throw err;
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      clearAuthCookies(res);
      sendResponse(res, StatusCodes.OK, {
        message: 'Logout successfully',
      });
    } catch (err) {
      throw err;
    }
  };
}
