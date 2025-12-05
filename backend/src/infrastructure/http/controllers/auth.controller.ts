import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { AuthService } from '../../../core/services/auth.service';

import { AppError } from '../../../shared/errors/app-error';
import {
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from '../../../shared/utils/jwt';
import { sendResponse } from '../../../shared/utils/response-handler';
import { User } from '../../database/models';

export class AuthController {
  constructor(private authService: AuthService) {}

  logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = verifyRefreshToken(token) as { userId: string };
        await User.update(
          { refresh_token: null },
          { where: { id: decoded.userId } },
        );
      } catch {
        // ignore
      }
    }

    clearAuthCookies(res);

    sendResponse(res, StatusCodes.OK, {
      message: 'خروج موفق',
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      throw new AppError('توکن الزامی است', StatusCodes.BAD_REQUEST);
    }

    const decoded = verifyRefreshToken(token) as { userId: string };

    const user = await User.findOne({
      where: { id: decoded.userId, refresh_token: token },
    });

    if (!user) {
      throw new AppError('توکن نامعتبر', StatusCodes.UNAUTHORIZED);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || '',
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } },
    );

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    sendResponse(res, StatusCodes.OK, {
      message: 'توکن تازه‌سازی شد',
      data: { accessToken, refreshToken },
    });
  };

  sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber } = req.body;

    await this.authService.sendOtp(phoneNumber);

    sendResponse(res, StatusCodes.OK, {
      message: 'کد تایید ارسال شد',
    });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, code } = req.body;

    const { user, isNewUser } = await this.authService.verifyOtp(
      phoneNumber,
      code,
    );

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || '',
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } },
    );

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    sendResponse(res, StatusCodes.OK, {
      message: isNewUser ? 'ثبت‌نام موفق' : 'ورود موفق',
      data: {
        user: {
          id: user.id,
          phoneNumber: user.phone_number,
          role: user.role,
        },
      },
    });
  };
}
