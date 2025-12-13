import { Router } from 'express';

import { BrandService } from '../../../core/services/brand.service';
import { BrandController } from '../controllers/brand.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { brandValidation } from '../validators';

const router = Router();

const brandService = new BrandService();
const controller = new BrandController(brandService);

router.get(
  '/',
  validateRequest(brandValidation.list, 'query'),
  controller.list,
);

router.get('/:id', controller.get); // ✅ FIX

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(brandValidation.create),
  controller.create,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(brandValidation.update),
  controller.update,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  controller.delete,
);

export { router as brandRoutes };
