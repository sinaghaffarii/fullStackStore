import { Router } from 'express';

import { AuthService } from '../../../core/services/auth.service';
import { SmsService } from '../../external/sms.service';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  adminLoginRateLimit,
  authRateLimit,
  otpRateLimit,
  refreshTokenRateLimit,
} from '../middlewares/rate-limit.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate, validateParams } from '../middlewares/validation.middleware';
import { authValidation } from '../validators/auth.validator';

const router = Router();

const smsService = new SmsService();
const authService = new AuthService(smsService);
const authController = new AuthController(authService);

router.post(
  '/send-otp',
  otpRateLimit,
  validate(authValidation.sendOtp),
  authController.sendOtp,
);

router.post(
  '/verify-otp',
  authRateLimit,
  validate(authValidation.verifyOtp),
  authController.verifyOtp,
);

// Admin Auth
router.post(
  '/admin/login',
  adminLoginRateLimit,
  validate(authValidation.adminLogin),
  authController.adminLogin,
);

router.get(
  '/admin/me',
  authMiddleware,
  requireAdmin,
  authController.getAdminProfile,
);

// Token Management
router.post(
  '/refresh-token',
  refreshTokenRateLimit,
  authController.refreshToken,
);

router.post('/logout', authMiddleware, authController.logout);
router.post('/logout-all', authMiddleware, authController.logoutAll);

// User Info
router.get('/me', authMiddleware, authController.getCurrentUser);

// Session Management
router.get('/sessions', authMiddleware, authController.getActiveSessions);
router.delete(
  '/sessions/:sessionId',
  authMiddleware,
  validateParams(authValidation.sessionId),
  authController.revokeSession,
);

export { router as authRoutes };
