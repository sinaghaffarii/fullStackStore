import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../../../core/services/auth.service';
import { EmailService } from '../../../infrastructure/external/email.service';
import { validateRequest } from '../middlewares/validation.middleware';
import { authValidation } from '../validators/auth.validator';

const router = Router();

// Dependency Injection
const emailService = new EmailService();
const authService = new AuthService(emailService);
const authController = new AuthController(authService);

router.post(
  '/send-otp',
  validateRequest(authValidation.sendOTP),
  authController.sendOTP,
);

router.post(
  '/verify-otp',
  validateRequest(authValidation.verifyOTP),
  authController.verifyOTP,
);

router.post('/logout', authController.logout);

export { router as authRoutes };
