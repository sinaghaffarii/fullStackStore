import { Router } from 'express';

import { AuthService } from '../../../core/services/auth.service';
import { SmsService } from '../../../infrastructure/external/sms.service';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

const smsService = new SmsService();
const authService = new AuthService(smsService);
const authController = new AuthController(authService);

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/admin/login', authController.adminLogin);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

export { router as authRoutes };
