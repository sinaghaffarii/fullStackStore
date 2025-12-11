// src/infrastructure/http/routes/category.routes.ts
import { Router } from 'express';

import { CategoryRepository } from '../../../core/repositories/category.repository';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  apiRateLimit,
  searchRateLimit,
  writeRateLimit,
} from '../middlewares/rate-limit.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { categoryValidation } from '../validators/category.validator';

const router = Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

// ==================== Public routes ====================
router.get(
  '/',
  apiRateLimit, // ✅ 60 در دقیقه
  validateRequest(categoryValidation.listCategories, 'query'),
  categoryController.listCategories,
);

router.get('/hierarchy', apiRateLimit, categoryController.getCategoryHierarchy);

router.get(
  '/search',
  searchRateLimit, // ✅ 30 در دقیقه
  categoryController.searchCategories,
);

router.get('/:id', apiRateLimit, categoryController.getCategory);

router.get(
  '/:parentId/subcategories',
  apiRateLimit,
  categoryController.getSubcategories,
);

// ==================== Protected routes (Admin only) ====================
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  writeRateLimit, // ✅ 20 در دقیقه
  validateRequest(categoryValidation.createCategory),
  categoryController.createCategory,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  writeRateLimit,
  validateRequest(categoryValidation.updateCategory),
  categoryController.updateCategory,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  writeRateLimit,
  categoryController.deleteCategory,
);

export { router as categoryRoutes };
