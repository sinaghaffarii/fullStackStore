import type { Request } from 'express';

import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../shared/utils/jwt';
import RefreshToken from '../models/refresh-token.model';
import TokenBlacklist from '../models/token-blacklist.model';
import User from '../models/user.model';

interface TokenPayload {
  userId: string;
  email?: string;
  role: string;
}

interface DecodedToken {
  userId: string;
  email?: string;
  role?: string;
  exp: number;
  iat: number;
}

export class TokenService {
  private get maxSessionsPerUser(): number {
    return 5;
  }

  private get refreshTokenExpiryDays(): number {
    return 7;
  }

  async blacklistToken(
    token: string,
    type: 'access' | 'refresh',
    expTimestamp?: number,
  ): Promise<void> {
    const tokenHash = this.hashToken(token);

    let expiresAt: Date;
    if (expTimestamp) {
      expiresAt = new Date(expTimestamp * 1000);
    } else {
      const duration =
        type === 'refresh' ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000;
      expiresAt = new Date(Date.now() + duration);
    }

    try {
      await TokenBlacklist.create({
        token_hash: tokenHash,
        token_type: type,
        expires_at: expiresAt,
      });
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err.name !== 'SequelizeUniqueConstraintError') {
        throw error;
      }
    }
  }

  async generateTokenPair(
    user: User,
    req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email || '',
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user.id });

    await this.saveRefreshToken(user.id, refreshToken, req);

    return { accessToken, refreshToken };
  }

  async getActiveSessions(userId: string) {
    const sessions = await RefreshToken.findAll({
      where: { user_id: userId },
      attributes: ['id', 'device_info', 'ip_address', 'created_at'],
      order: [['created_at', 'DESC']],
    });

    return sessions.map((s) => ({
      id: s.id,
      deviceInfo: s.device_info,
      ipAddress: s.ip_address,
      createdAt: s.created_at,
    }));
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.destroy({ where: { user_id: userId } });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await RefreshToken.destroy({ where: { token_hash: tokenHash } });
    await this.blacklistToken(token, 'refresh');
  }

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const result = await RefreshToken.destroy({
      where: { id: sessionId, user_id: userId },
    });
    return result > 0;
  }

  async validateAndRefreshTokens(
    refreshTokenValue: string,
    req: Request,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    let decoded: DecodedToken;
    try {
      decoded = verifyRefreshToken(refreshTokenValue) as DecodedToken;
    } catch {
      throw new AppError('توکن نامعتبر یا منقضی شده', StatusCodes.UNAUTHORIZED);
    }

    const tokenHash = this.hashToken(refreshTokenValue);
    const isBlacklisted = await TokenBlacklist.isBlacklisted(tokenHash);
    if (isBlacklisted) {
      throw new AppError('توکن باطل شده است', StatusCodes.UNAUTHORIZED);
    }

    const storedToken = await RefreshToken.findOne({
      where: { user_id: decoded.userId, token_hash: tokenHash },
    });

    if (!storedToken) {
      throw new AppError('توکن یافت نشد', StatusCodes.UNAUTHORIZED);
    }

    if (storedToken.isExpired()) {
      await storedToken.destroy();
      throw new AppError('توکن منقضی شده', StatusCodes.UNAUTHORIZED);
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new AppError('کاربر یافت نشد', StatusCodes.UNAUTHORIZED);
    }

    await storedToken.destroy();
    await this.blacklistToken(refreshTokenValue, 'refresh', decoded.exp);

    const tokens = await this.generateTokenPair(user, req);

    return { ...tokens, user };
  }

  async verifyAccessTokenWithBlacklist(token: string): Promise<DecodedToken> {
    const decoded = verifyAccessToken(token) as DecodedToken;

    const tokenHash = this.hashToken(token);
    const isBlacklisted = await TokenBlacklist.isBlacklisted(tokenHash);

    if (isBlacklisted) {
      throw new AppError('توکن باطل شده است', StatusCodes.UNAUTHORIZED);
    }

    return decoded;
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'Unknown';
  }

  private getDeviceInfo(req: Request): string {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    return userAgent.substring(0, 500);
  }

  private async saveRefreshToken(
    userId: string,
    token: string,
    req: Request,
  ): Promise<void> {
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(
      Date.now() + this.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
    );

    await RefreshToken.create({
      user_id: userId,
      token_hash: tokenHash,
      device_info: this.getDeviceInfo(req),
      ip_address: this.getClientIp(req),
      expires_at: expiresAt,
    });

    await RefreshToken.cleanupExcessTokens(userId, this.maxSessionsPerUser);
  }
}

export const tokenService = new TokenService();
