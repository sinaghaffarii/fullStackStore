import { Router } from 'express';

import { ProductRepository } from '../../../core/repositories/product.repository';
import { ProductService } from '../../../core/services/product.service';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { productValidation } from '../validators/product.validator';

const router = Router();

// Dependency Injection
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Public routes
router.get(
  '/',
  validateRequest(productValidation.listProducts, 'query'),
  productController.listProducts,
);

router.get('/:id', productController.getProduct);

router.get('/category/:categoryId', productController.getProductsByCategory);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.createProduct),
  productController.createProduct,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.updateProduct),
  productController.updateProduct,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  productController.deleteProduct,
);

router.patch(
  '/:id/stock',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(productValidation.updateStock),
  productController.updateStock,
);

export { router as productRoutes };
