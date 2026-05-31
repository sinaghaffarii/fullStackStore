import { Router } from 'express';

import { SmsService } from '../../../external/sms.service';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import {
  adminLoginRateLimit,
  authRateLimit,
  otpRateLimit,
  refreshTokenRateLimit,
} from '../../../middlewares/rate-limit.middleware';
import {
  requireAdmin,
  requireSuperAdmin,
} from '../../../middlewares/role.middleware';
import {
  validate,
  validateParams,
} from '../../../middlewares/validation.middleware';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { authValidation } from '../validators/auth.validator';

const router = Router();

const smsService = new SmsService();
const authService = new AuthService(smsService);
const authController = new AuthController(authService);

// ==================== Customer Auth ====================

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

// ==================== Admin Auth ====================

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

// ==================== Admin Management (SuperAdmin Only) ====================

// ایجاد ادمین جدید
router.post(
  '/admin/create',
  authMiddleware,
  requireSuperAdmin,
  authRateLimit,
  validate(authValidation.createAdmin),
  authController.createAdmin,
);

// لیست همه ادمین‌ها
router.get(
  '/admin/list',
  authMiddleware,
  requireSuperAdmin,
  authController.getAdminList,
);

// دریافت اطلاعات یک ادمین
router.get(
  '/admin/:adminId',
  authMiddleware,
  requireSuperAdmin,
  validateParams(authValidation.adminId),
  authController.getAdminById,
);

// بروزرسانی اطلاعات ادمین
router.put(
  '/admin/:adminId',
  authMiddleware,
  requireSuperAdmin,
  validateParams(authValidation.adminId),
  validate(authValidation.updateAdmin),
  authController.updateAdmin,
);

// ✅ Toggle وضعیت ادمین (فعال/غیرفعال)
router.patch(
  '/admin/:adminId/toggle-status',
  authMiddleware,
  requireSuperAdmin,
  validateParams(authValidation.adminId),
  authController.toggleAdminStatus,
);

// ==================== Token Management ====================

router.post(
  '/refresh-token',
  refreshTokenRateLimit,
  authController.refreshToken,
);

router.post('/logout', authMiddleware, authController.logout);
router.post('/logout-all', authMiddleware, authController.logoutAll);

// ==================== User Info ====================

router.get('/me', authMiddleware, authController.getCurrentUser);

// ==================== Session Management ====================

router.get('/sessions', authMiddleware, authController.getActiveSessions);
router.delete(
  '/sessions/:sessionId',
  authMiddleware,
  validateParams(authValidation.sessionId),
  authController.revokeSession,
);

export { router as authRoutes };
