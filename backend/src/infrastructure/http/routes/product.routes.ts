import { Router } from 'express';

import { ProductRepository } from '../../../core/repositories/product.repository';
import { ProductService } from '../../../core/services/product.service';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  apiRateLimit,
  strictRateLimit,
} from '../middlewares/rate-limit.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { productValidation } from '../validators/product.validator';

const router = Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// ==================== Public routes ====================
// Rate limit: 60 درخواست در دقیقه

router.get(
  '/',
  apiRateLimit,
  validateRequest(productValidation.listProducts, 'query'),
  productController.listProducts,
);

router.get('/:id', apiRateLimit, productController.getProduct);

router.get(
  '/category/:categoryId',
  apiRateLimit,
  productController.getProductsByCategory,
);

// ==================== Protected routes (Admin only) ====================
// Rate limit: 30 عملیات در 15 دقیقه

router.post(
  '/',
  strictRateLimit,
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.createProduct),
  productController.createProduct,
);

router.put(
  '/:id',
  strictRateLimit,
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.updateProduct),
  productController.updateProduct,
);

router.delete(
  '/:id',
  strictRateLimit,
  authMiddleware,
  roleMiddleware(['admin']),
  productController.deleteProduct,
);

router.patch(
  '/:id/stock',
  strictRateLimit,
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.updateStock),
  productController.updateStock,
);

export { router as productRoutes };
