import { Router } from 'express';

import { BrandService } from '../../../core/services/brand.service';
import { Role } from '../../../shared/types-enums/role.enum';
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
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(brandValidation.create),
  controller.create,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(brandValidation.update),
  controller.update,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  controller.delete,
);

export { router as brandRoutes };
