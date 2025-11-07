import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../../../core/services/auth.service';
import { AppError } from '../../../shared/errors/app-error';
import { sendResponse } from '../../../shared/utils/response-handler';
import {
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '../../../shared/utils/jwt';
import { User } from '../../database/models';

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

      const accessToken = generateAccessToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
      });

      const refreshToken = generateRefreshToken({
        userId: result.user.id,
        email: result.user.email,
      });

      setAccessTokenCookie(res, accessToken);
      setRefreshTokenCookie(res, refreshToken);

      await User.update(
        { refresh_token: refreshToken },
        { where: { id: result.user.id } },
      );

      sendResponse(res, StatusCodes.OK, {
        message: 'OTP verified successfully',
        data: {
          user: result.user,
        },
      });
    } catch (err) {
      console.error('Error in verifyOTP:', err);
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
