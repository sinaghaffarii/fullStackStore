import { Router } from 'express';

import { authMiddleware } from '../../../middlewares/auth.middleware';
import { roleMiddleware } from '../../../middlewares/role.middleware';
import { validateRequest } from '../../../middlewares/validation.middleware';
import { Role } from '../../../shared/types-enums/role.enum';
import { DiscountController } from '../controllers/discount.controller';
import DiscountService from '../services/discount.service';
import { discountValidation } from '../validators/discount.validator';

const router = Router();
const controller = new DiscountController(new DiscountService());

router.get(
  '/',
  authMiddleware,
  validateRequest(discountValidation.list, 'query'),
  controller.list,
);
router.get('/banners', controller.banners);
router.get('/:id', controller.get);

router.post(
  '/',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(discountValidation.create),
  controller.create,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(discountValidation.update),
  controller.update,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  controller.delete,
);

router.patch(
  '/:id/toggle',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  controller.toggle,
);

export { router as discountRoutes };
