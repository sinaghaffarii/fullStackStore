import { Router } from 'express';

import { ProductRepository } from '../../../core/repositories/product.repository';
import { ProductService } from '../../../core/services/product.service';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { productValidation } from '../validators';

const router = Router();

/* ✅ Dependency Injection */
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const controller = new ProductController(productService);

/* ================= Routes ================= */

router.get(
  '/',
  validateRequest(productValidation.list, 'query'),
  controller.list,
);

router.get('/slug/:slug', controller.getBySlug);
router.get('/:id', controller.getById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.create),
  controller.create,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.update),
  controller.update,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  controller.delete,
);

router.patch(
  '/stock',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.updateStock),
  controller.updateStock,
);

export { router as productRoutes };
