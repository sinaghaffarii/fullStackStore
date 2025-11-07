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
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        try {
          const decoded = verifyRefreshToken(refreshToken) as {
            userId: string;
          };

          await User.update(
            { refresh_token: null },
            { where: { id: decoded.userId } },
          );
        } catch (error) {
          console.log('Invalid refresh token during logout');
        }
      }

      clearAuthCookies(res);

      sendResponse(res, StatusCodes.OK, {
        message: 'Logout successfully',
      });
    } catch (err) {
      console.error('Error in logout:', err);
      throw err;
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new AppError(
          'Refresh token is required',
          StatusCodes.BAD_REQUEST,
        );
      }

      const decoded = verifyRefreshToken(refreshToken) as {
        userId: string;
        email: string;
      };

      // check if refresh token exists in database and matches
      const user = await User.findOne({
        where: {
          id: decoded.userId,
          refresh_token: refreshToken,
        },
      });

      if (!user) {
        throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
      }

      // generate new tokens
      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      // update refresh token in database
      await User.update(
        { refresh_token: newRefreshToken },
        { where: { id: user.id } },
      );

      // set new cookies
      setAccessTokenCookie(res, newAccessToken);
      setRefreshTokenCookie(res, newRefreshToken);

      sendResponse(res, StatusCodes.OK, {
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
    }
  };

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

      if (!email || !code) {
        throw new AppError(
          'Email and OTP code are required',
          StatusCodes.BAD_REQUEST,
        );
      }

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

      // set cookies
      setAccessTokenCookie(res, accessToken);
      setRefreshTokenCookie(res, refreshToken);

      // save refresh token to database
      await User.update(
        { refresh_token: refreshToken },
        { where: { id: result.user.id } },
      );

      sendResponse(res, StatusCodes.OK, {
        message: 'OTP verified successfully',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            is_verified: result.user.is_verified,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      });
    } catch (err) {
      console.error('Error in verifyOTP:', err);
      throw err;
    }
  };
}
