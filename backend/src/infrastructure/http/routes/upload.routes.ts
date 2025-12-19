import { Router } from 'express';

import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { uploadSingleImage } from '../middlewares/upload.middleware';

const router = Router();
const controller = new UploadController();

router.post(
  '/image',
  authMiddleware,
  roleMiddleware(['admin']),
  uploadSingleImage,
  controller.uploadImage,
);

export { router as uploadRoutes };
