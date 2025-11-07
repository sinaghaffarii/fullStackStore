import { Router } from 'express';

import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { authValidation } from '../validators/auth.validator';

const router = Router();

const profileController = new ProfileController();

// Public routes - Password reset
router.post(
  '/password/reset/request',
  validateRequest(authValidation.requestPasswordReset),
  profileController.requestPasswordReset,
);

router.post(
  '/password/reset/verify',
  validateRequest(authValidation.verifyPasswordReset),
  profileController.verifyPasswordReset,
);

router.post(
  '/password/reset',
  validateRequest(authValidation.resetPassword),
  profileController.resetPassword,
);

// Protected routes - Require authentication
router.get('/me', authMiddleware, profileController.getProfile);

router.put(
  '/me',
  authMiddleware,
  validateRequest(authValidation.updateProfile),
  profileController.updateProfile,
);

router.post(
  '/password/change',
  authMiddleware,
  validateRequest(authValidation.changePassword),
  profileController.changePassword,
);

export { router as profileRoutes };
