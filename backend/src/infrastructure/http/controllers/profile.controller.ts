import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import { PasswordService } from '../../../core/services/password.service';
import { EmailService } from '../../../infrastructure/external/email.service';
import { AppError } from '../../../shared/errors/app-error';
import { sendResponse } from '../../../shared/utils/response-handler';
import { User } from '../../database/models';

export class ProfileController {
  private passwordService: PasswordService;

  constructor() {
    const emailService = new EmailService();
    this.passwordService = new PasswordService(emailService);
  }

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', StatusCodes.UNAUTHORIZED);
      }

      await this.passwordService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      sendResponse(res, StatusCodes.OK, {
        message: 'Password changed successfully',
      });
    } catch (error) {
      throw error;
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', StatusCodes.UNAUTHORIZED);
      }

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['refresh_token', 'password'] },
      });

      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      sendResponse(res, StatusCodes.OK, {
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      throw error;
    }
  };

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError('Email is required', StatusCodes.BAD_REQUEST);
      }

      await this.passwordService.requestPasswordReset(email);

      // For security, don't reveal if email exists or not
      sendResponse(res, StatusCodes.OK, {
        message: 'If the email exists, a password reset code has been sent',
      });
    } catch (error) {
      throw error;
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        throw new AppError(
          'Reset token and new password are required',
          StatusCodes.BAD_REQUEST,
        );
      }

      await this.passwordService.resetPassword(resetToken, newPassword);

      sendResponse(res, StatusCodes.OK, {
        message: 'Password reset successfully',
      });
    } catch (error) {
      throw error;
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { email } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', StatusCodes.UNAUTHORIZED);
      }

      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new AppError('Email already exists', StatusCodes.CONFLICT);
        }
      }

      // Update fields
      await user.update({
        email: email || user.email,
      });

      sendResponse(res, StatusCodes.OK, {
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  verifyPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        throw new AppError(
          'Email and code are required',
          StatusCodes.BAD_REQUEST,
        );
      }

      const result = await this.passwordService.verifyPasswordResetOTP(
        email,
        code,
      );

      sendResponse(res, StatusCodes.OK, {
        message: 'Password reset code verified successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  };
}
