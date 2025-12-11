import { Router } from 'express';

import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  authRateLimit,
  passwordResetRateLimit,
  strictRateLimit,
} from '../middlewares/rate-limit.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { authValidation } from '../validators/auth.validator';

const router = Router();

const profileController = new ProfileController();

// ==================== Public routes - Password reset ====================
// Rate limit: 3 بار در ساعت

router.post(
  '/password/reset/request',
  passwordResetRateLimit,
  validateRequest(authValidation.requestPasswordReset),
  profileController.requestPasswordReset,
);

router.post(
  '/password/reset/verify',
  authRateLimit,
  validateRequest(authValidation.verifyPasswordReset),
  profileController.verifyPasswordReset,
);

router.post(
  '/password/reset',
  authRateLimit,
  validateRequest(authValidation.resetPassword),
  profileController.resetPassword,
);

// ==================== Protected routes ====================

router.get('/me', authMiddleware, profileController.getProfile);

router.put(
  '/me',
  strictRateLimit,
  authMiddleware,
  validateRequest(authValidation.updateProfile),
  profileController.updateProfile,
);

router.post(
  '/password/change',
  strictRateLimit,
  authMiddleware,
  validateRequest(authValidation.changePassword),
  profileController.changePassword,
);

export { router as profileRoutes };
