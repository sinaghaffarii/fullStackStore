// src/infrastructure/http/controllers/auth.controller.ts
import type { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

import type { AuthService } from '../../../core/services/auth.service';

import { AppError } from '../../../shared/errors/app-error';
import { verifyCaptcha } from '../../../shared/utils/captcha';
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

  // ============================================================================
  // لاگین ادمین
  // ============================================================================

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { username, password, captchaToken } = req.body;

    // اعتبارسنجی ورودی‌ها
    this.validateAdminLoginInput(username, password, captchaToken);

    // تأیید کپچا
    await this.validateCaptcha(captchaToken);

    // پیدا کردن و اعتبارسنجی کاربر
    const user = await this.findAndValidateAdmin(username, password);

    // تولید توکن‌ها و تنظیم کوکی‌ها
    const { accessToken, refreshToken } =
      await this.generateTokensAndSetCookies(res, user);

    sendResponse(res, StatusCodes.OK, {
      message: 'ورود موفق',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  };

  // ============================================================================
  // خروج
  // ============================================================================

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const user = await User.findByPk(userId, {
      attributes: [
        'id',
        'username',
        'email',
        'phone_number',
        'role',
        'created_at',
      ],
    });

    if (!user) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    sendResponse(res, StatusCodes.OK, {
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phone_number,
        role: user.role,
        createdAt: user.created_at,
      },
      message: 'کاربر با موفقیت یافت شد.',
    });
  };

  // ============================================================================
  // تازه‌سازی توکن
  // ============================================================================

  logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;

    if (token) {
      await this.invalidateRefreshToken(token);
    }

    this.clearAllCookies(res);

    sendResponse(res, StatusCodes.OK, {
      message: 'خروج موفق',
    });
  };

  // ============================================================================
  // ارسال OTP
  // ============================================================================

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      throw new AppError('توکن الزامی است', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const decoded = verifyRefreshToken(token) as { userId: string };

    const user = await User.findOne({
      where: { id: decoded.userId, refresh_token: token },
    });

    if (!user) {
      throw new AppError('توکن نامعتبر', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokensAndSetCookies(res, user);

    sendResponse(res, StatusCodes.OK, {
      message: 'توکن تازه‌سازی شد',
      data: { accessToken, refreshToken: newRefreshToken },
    });
  };

  // ============================================================================
  // تأیید OTP
  // ============================================================================

  sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber } = req.body;

    await this.authService.sendOtp(phoneNumber);

    sendResponse(res, StatusCodes.OK, {
      message: 'کد تایید ارسال شد',
    });
  };

  // ============================================================================
  // دریافت کاربر فعلی
  // ============================================================================

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, code } = req.body;

    const { user, isNewUser } = await this.authService.verifyOtp(
      phoneNumber,
      code,
    );

    const { accessToken, refreshToken } =
      await this.generateTokensAndSetCookies(res, user);

    sendResponse(res, StatusCodes.OK, {
      message: isNewUser ? 'ثبت‌نام موفق' : 'ورود موفق',
      data: {
        user: {
          id: user.id,
          phoneNumber: user.phone_number,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  };

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private clearAllCookies(res: Response): void {
    clearAuthCookies(res);
    res.clearCookie('isAuth');
    res.clearCookie('userRole');
  }

  private async findAndValidateAdmin(
    username: string,
    password: string,
  ): Promise<User> {
    // ✅ استفاده از Op.and برای جستجوی صحیح
    const user = await User.findOne({
      where: {
        [Op.and]: [{ username }, { role: 'admin' }],
      },
    });

    if (!user) {
      throw new AppError('نام کاربری یا رمز عبور اشتباه است', {
        statusCode: StatusCodes.UNAUTHORIZED,
        field: 'username',
      });
    }

    // بررسی رمز عبور
    if (!user.password) {
      throw new AppError('حساب کاربری معتبر نیست', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('نام کاربری یا رمز عبور اشتباه است', {
        statusCode: StatusCodes.UNAUTHORIZED,
        field: 'username',
      });
    }

    return user;
  }

  private async generateTokensAndSetCookies(
    res: Response,
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || '',
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // ذخیره refresh token
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } },
    );

    // تنظیم کوکی‌های JWT
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    // تنظیم کوکی‌های اضافی برای middleware فرانت‌اند
    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
    };

    res.cookie('isAuth', 'true', cookieOptions);
    res.cookie('userRole', user.role, cookieOptions);

    return { accessToken, refreshToken };
  }

  private async invalidateRefreshToken(token: string): Promise<void> {
    try {
      const decoded = verifyRefreshToken(token) as { userId: string };
      await User.update(
        { refresh_token: null },
        { where: { id: decoded.userId } },
      );
    } catch {
      // نادیده گرفتن خطا
    }
  }

  private validateAdminLoginInput(
    username: string,
    password: string,
    captchaToken: string,
  ): void {
    if (!username || !password) {
      throw new AppError('نام کاربری و رمز عبور الزامی است', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!captchaToken) {
      throw new AppError('لطفاً کپچا را تکمیل کنید', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  }

  private async validateCaptcha(captchaToken: string): Promise<void> {
    const captchaResult = await verifyCaptcha(captchaToken);

    if (!captchaResult.success) {
      throw new AppError('کپچا نامعتبر است. لطفاً دوباره تلاش کنید', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
  }
}
