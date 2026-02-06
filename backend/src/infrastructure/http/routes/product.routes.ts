import { Router } from 'express';

import { ProductService } from '../../../core/services/product.service';
import { Role } from '../../../shared/types-enums/role.enum';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { productValidation } from '../validators';

const router = Router();

const productService = new ProductService();
const controller = new ProductController(productService);

router.get(
  '/',
  validateRequest(productValidation.list, 'query'),
  controller.list.bind(controller),
);

router.get('/slug/:slug', controller.getBySlug.bind(controller));

router.get('/:id', controller.getById.bind(controller));

router.post(
  '/',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(productValidation.create),
  controller.create.bind(controller),
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(productValidation.update),
  controller.update.bind(controller),
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(productValidation.update),
  controller.update.bind(controller),
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  controller.delete.bind(controller),
);

router.patch(
  '/:id/stock',
  authMiddleware,
  roleMiddleware([Role.Admin, Role.SuperAdmin]),
  validateRequest(productValidation.updateStock),
  controller.updateStock.bind(controller),
);

export { router as productRoutes };
