import { Router } from 'express';

import { DiscountService } from '../../../core/services/discount.service';
import { DiscountController } from '../controllers/discount.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { discountValidation } from '../validators';

const router = Router();
const controller = new DiscountController(new DiscountService());

router.get(
  '/',
  validateRequest(discountValidation.list, 'query'),
  controller.list,
);
router.get('/banners', controller.banners);
router.get('/:id', controller.get);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(discountValidation.create),
  controller.create,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(discountValidation.update),
  controller.update,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  controller.delete,
);

router.patch(
  '/:id/toggle',
  authMiddleware,
  roleMiddleware(['admin']),
  controller.toggle,
);

export { router as discountRoutes };
