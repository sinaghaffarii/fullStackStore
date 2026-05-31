import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { tokenService } from '../modules/user/services/token.service';
import { AppError } from '../shared/errors/app-error';
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '../shared/utils/jwt';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

interface TokenRefreshResult {
  user: AuthUser;
  newAccessToken: string;
  newRefreshToken: string;
}

// ==================== Main Auth Middleware ====================

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = extractAccessToken(req);
    const refreshToken = req.cookies.refreshToken;

    // حالت 1: Access Token معتبره
    const userFromAccess = await tryVerifyAccessToken(accessToken);
    if (userFromAccess) {
      req.user = userFromAccess;
      next();
      return;
    }

    // حالت 2: Access Token منقضی، Refresh Token داریم
    const refreshResult = await trySilentRefresh(refreshToken, req);
    if (refreshResult) {
      applyRefreshedTokens(res, refreshResult);
      req.user = refreshResult.user;
      next();
      return;
    }

    // حالت 3: هیچ توکن معتبری نداریم
    throw new AppError('لطفاً وارد شوید', {
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(
      new AppError('خطا در احراز هویت', {
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  }
};

// ==================== Optional Auth Middleware ====================

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = extractAccessToken(req);
    const refreshToken = req.cookies.refreshToken;

    // سعی کن با access token
    const userFromAccess = await tryVerifyAccessToken(accessToken);
    if (userFromAccess) {
      req.user = userFromAccess;
      next();
      return;
    }

    // سعی کن با refresh token
    const refreshResult = await trySilentRefresh(refreshToken, req);
    if (refreshResult) {
      applyRefreshedTokens(res, refreshResult);
      req.user = refreshResult.user;
    }

    next();
  } catch {
    // نادیده بگیر - کاربر مهمان
    next();
  }
};

// ==================== Helper Functions ====================

function extractAccessToken(req: Request): string | null {
  if (req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  const authHeader = req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

async function tryVerifyAccessToken(
  accessToken: string | null,
): Promise<AuthUser | null> {
  if (!accessToken) return null;

  try {
    const decoded =
      await tokenService.verifyAccessTokenWithBlacklist(accessToken);

    return {
      userId: decoded.userId,
      email: decoded.email || '',
      role: decoded.role || 'customer',
    };
  } catch {
    return null;
  }
}

async function trySilentRefresh(
  refreshToken: string | undefined,
  req: Request,
): Promise<TokenRefreshResult | null> {
  if (!refreshToken) return null;

  try {
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    } = await tokenService.validateAndRefreshTokens(refreshToken, req);

    return {
      user: {
        userId: user.id,
        email: user.email || '',
        role: user.role,
      },
      newAccessToken,
      newRefreshToken,
    };
  } catch {
    return null;
  }
}

function applyRefreshedTokens(res: Response, result: TokenRefreshResult): void {
  setAccessTokenCookie(res, result.newAccessToken);
  setRefreshTokenCookie(res, result.newRefreshToken);
  res.setHeader('X-Token-Refreshed', 'true');
}
