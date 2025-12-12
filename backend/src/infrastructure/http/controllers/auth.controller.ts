import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { AuthService } from '../../../core/services/auth.service';
import type { AuthUser } from '../middlewares/auth.middleware';

import { tokenService } from '../../../core/services/token.service';
import { AppError } from '../../../shared/errors/app-error';
// import { verifyCaptcha } from '../../../shared/utils/captcha';
import {
  clearAuthCookies,
  setAccessTokenCookie,
  setAuthStateCookie,
  setRefreshTokenCookie,
} from '../../../shared/utils/jwt';
import { sendResponse } from '../../../shared/utils/response-handler';
import { createSignedAuthState } from '../../../shared/utils/signed-cookie';

// ============================================================================
// Types
// ============================================================================

interface AuthCookieOptions {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: 'admin' | 'customer';
}

// Helper برای گرفتن userId از req.user
const getUserId = (user?: AuthUser): string | undefined => {
  return user?.userId;
};

// ============================================================================
// Controller
// ============================================================================

export class AuthController {
  constructor(private authService: AuthService) {}

  // ==================== Admin Login ====================

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    // const { username, password, captchaToken } = req.body;
    const { username, password } = req.body;

    // // تایید کپچا
    // const captchaResult = await verifyCaptcha(captchaToken);
    // if (!captchaResult.success) {
    //   throw new AppError('کپچا نامعتبر است', {
    //     statusCode: StatusCodes.BAD_REQUEST,
    //   });
    // }

    // بررسی اطلاعات ورود
    const user = await this.authService.adminLogin(username, password);

    // تولید توکن‌ها
    const { accessToken, refreshToken } = await tokenService.generateTokenPair(
      user,
      req,
    );

    // ست کردن کوکی‌ها
    this.setAuthCookies(res, {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role as 'admin' | 'customer',
    });

    // ارسال پاسخ
    sendResponse(res, StatusCodes.OK, {
      message: 'ورود موفق',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  };

  // ==================== Send OTP ====================

  getActiveSessions = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const sessions = await tokenService.getActiveSessions(userId);

    sendResponse(res, StatusCodes.OK, {
      message: 'لیست نشست‌های فعال',
      data: { sessions },
    });
  };

  // ==================== Verify OTP ====================

  getAdminProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const admin = await this.authService.getAdminById(userId);

    if (!admin) {
      throw new AppError('ادمین یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    sendResponse(res, StatusCodes.OK, {
      message: 'اطلاعات ادمین',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.created_at,
        updatedAt: admin.updated_at,
      },
    });
  };

  // ==================== Refresh Token ====================

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const user = await this.authService.getUserById(userId);

    if (!user) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    sendResponse(res, StatusCodes.OK, {
      message: 'اطلاعات کاربر',
      data: user.toSafeObject(),
    });
  };

  // ==================== Logout ====================

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    // ابطال توکن‌ها
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }

    if (accessToken) {
      await tokenService.blacklistToken(accessToken, 'access');
    }

    // پاک کردن کوکی‌ها
    clearAuthCookies(res);

    sendResponse(res, StatusCodes.OK, {
      message: 'خروج موفق',
    });
  };

  // ==================== Logout All ====================

  logoutAll = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    // ابطال همه توکن‌های کاربر
    await tokenService.revokeAllUserTokens(userId);

    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      await tokenService.blacklistToken(accessToken, 'access');
    }

    // پاک کردن کوکی‌ها
    clearAuthCookies(res);

    sendResponse(res, StatusCodes.OK, {
      message: 'از همه دستگاه‌ها خارج شدید',
    });
  };

  // ==================== Get Current User ====================

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new AppError('توکن تازه‌سازی یافت نشد', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    // تایید و تازه‌سازی توکن
    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await tokenService.validateAndRefreshTokens(token, req);

    // ست کردن کوکی‌های جدید
    this.setAuthCookies(res, {
      accessToken,
      refreshToken: newRefreshToken,
      userId: user.id,
      role: user.role as 'admin' | 'customer',
    });

    sendResponse(res, StatusCodes.OK, {
      message: 'توکن تازه‌سازی شد',
    });
  };

  // ==================== Get Admin Profile ====================

  revokeSession = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);
    const { sessionId } = req.params;

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const revoked = await tokenService.revokeSession(userId, sessionId);

    if (!revoked) {
      throw new AppError('نشست یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    sendResponse(res, StatusCodes.OK, {
      message: 'نشست با موفقیت بسته شد',
    });
  };

  // ==================== Get Active Sessions ====================

  sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber } = req.body;

    await this.authService.sendOtp(phoneNumber);

    sendResponse(res, StatusCodes.OK, {
      message: 'کد تأیید ارسال شد',
    });
  };

  // ==================== Revoke Session ====================

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, code } = req.body;

    // تایید OTP
    const { user, isNewUser } = await this.authService.verifyOtp(
      phoneNumber,
      code,
    );

    // تولید توکن‌ها
    const { accessToken, refreshToken } = await tokenService.generateTokenPair(
      user,
      req,
    );

    // ست کردن کوکی‌ها
    this.setAuthCookies(res, {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role as 'admin' | 'customer',
    });

    // ارسال پاسخ
    sendResponse(res, StatusCodes.OK, {
      message: isNewUser ? 'ثبت‌نام موفق' : 'ورود موفق',
      data: {
        user: user.toSafeObject(),
      },
    });
  };

  // ==================== Private Helpers ====================

  /**
   * ست کردن همه کوکی‌های احراز هویت
   */
  private setAuthCookies(res: Response, options: AuthCookieOptions): void {
    const { accessToken, refreshToken, userId, role } = options;

    // کوکی‌های httpOnly برای امنیت
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    // کوکی امضا شده برای middleware فرانت‌اند
    const signedAuthState = createSignedAuthState(userId, role);
    setAuthStateCookie(res, signedAuthState);
  }
}
