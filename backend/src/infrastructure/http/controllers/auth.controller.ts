import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { AuthService } from '../../../core/services/auth.service';
import type { Role } from '../../../shared/types-enums/role.enum';
import type { AuthUser } from '../middlewares/auth.middleware';

import { tokenService } from '../../../core/services/token.service';
import { AppError } from '../../../shared/errors/app-error';
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
  role: Role;
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

  // ==================== Customer Auth ====================

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const user = await this.authService.adminLogin(username, password);

    const { accessToken, refreshToken } = await tokenService.generateTokenPair(
      user,
      req,
    );

    this.setAuthCookies(res, {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role,
    });

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

  // ==================== Admin Auth ====================

  createAdmin = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    const currentUserRole = (req.user as AuthUser)?.role as Role;

    if (!currentUserRole) {
      throw new AppError('اطلاعات کاربر در توکن یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const admin = await this.authService.createAdmin(
      { username, email, password },
      currentUserRole,
    );

    sendResponse(res, StatusCodes.CREATED, {
      message: 'ادمین با موفقیت ایجاد شد',
      data: {
        admin: admin.toSafeObject(),
      },
    });
  };

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

  // ==================== Admin Management ====================

  getAdminById = async (req: Request, res: Response): Promise<void> => {
    const { adminId } = req.params;

    const admin = await this.authService.getAdminById(adminId);

    if (!admin) {
      throw new AppError('ادمین یافت نشد', {
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    sendResponse(res, StatusCodes.OK, {
      message: 'اطلاعات ادمین',
      data: admin.toSafeObject(),
    });
  };

  getAdminList = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const search = req.query.search as string | undefined;
    const isActive =
      req.query.is_active === 'true'
        ? true
        : req.query.is_active === 'false'
          ? false
          : undefined;

    const result = await this.authService.getAdminList(userId, {
      page,
      limit,
      search,
      isActive,
    });

    sendResponse(res, StatusCodes.OK, {
      message: 'لیست ادمین‌ها',
      data: {
        items: result.items.map((admin) => admin.toSafeObject()),
        pagination: result.pagination,
      },
    });
  };

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
      data: admin.toSafeObject(),
    });
  };

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

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }

    if (accessToken) {
      await tokenService.blacklistToken(accessToken, 'access');
    }

    clearAuthCookies(res);

    sendResponse(res, StatusCodes.OK, {
      message: 'خروج موفق',
    });
  };

  logoutAll = async (req: Request, res: Response): Promise<void> => {
    const userId = getUserId(req.user);

    if (!userId) {
      throw new AppError('کاربر یافت نشد', {
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    await tokenService.revokeAllUserTokens(userId);

    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      await tokenService.blacklistToken(accessToken, 'access');
    }

    clearAuthCookies(res);

    sendResponse(res, StatusCodes.OK, {
      message: 'از همه دستگاه‌ها خارج شدید',
    });
  };

  // ==================== Token Management ====================

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new AppError('توکن تازه‌سازی یافت نشد', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await tokenService.validateAndRefreshTokens(token, req);

    this.setAuthCookies(res, {
      accessToken,
      refreshToken: newRefreshToken,
      userId: user.id,
      role: user.role as Role,
    });

    sendResponse(res, StatusCodes.OK, {
      message: 'توکن تازه‌سازی شد',
    });
  };

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

  sendOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber } = req.body;

    await this.authService.sendOtp(phoneNumber);

    sendResponse(res, StatusCodes.OK, {
      message: 'کد تأیید ارسال شد',
    });
  };

  // ==================== User Info ====================

  toggleAdminStatus = async (req: Request, res: Response): Promise<void> => {
    const { adminId } = req.params;
    const currentUserRole = (req.user as AuthUser)?.role as Role;

    const admin = await this.authService.toggleAdminStatus(
      adminId,
      currentUserRole,
    );

    const statusMessage = admin.is_active ? 'فعال' : 'غیرفعال';

    sendResponse(res, StatusCodes.OK, {
      message: `ادمین با موفقیت ${statusMessage} شد`,
      data: { admin: admin.toSafeObject() },
    });
  };

  // ==================== Session Management ====================

  updateAdmin = async (req: Request, res: Response): Promise<void> => {
    const { adminId } = req.params;
    const { email, is_active } = req.body;
    const currentUserRole = (req.user as AuthUser)?.role as Role;

    const admin = await this.authService.updateAdmin(
      adminId,
      { email, is_active },
      currentUserRole,
    );

    sendResponse(res, StatusCodes.OK, {
      message: 'ادمین با موفقیت بروزرسانی شد',
      data: {
        admin: admin.toSafeObject(),
      },
    });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { phoneNumber, code } = req.body;

    const { user, isNewUser } = await this.authService.verifyOtp(
      phoneNumber,
      code,
    );

    const { accessToken, refreshToken } = await tokenService.generateTokenPair(
      user,
      req,
    );

    this.setAuthCookies(res, {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role,
    });

    sendResponse(res, StatusCodes.OK, {
      message: isNewUser ? 'ثبت‌نام موفق' : 'ورود موفق',
      data: {
        user: user.toSafeObject(),
      },
    });
  };

  // ==================== Private Helpers ====================

  private setAuthCookies(res: Response, options: AuthCookieOptions): void {
    const { accessToken, refreshToken, userId, role } = options;

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    const signedAuthState = createSignedAuthState(userId, role);
    setAuthStateCookie(res, signedAuthState);
  }
}
