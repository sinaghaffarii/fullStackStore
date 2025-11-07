import { Router } from 'express';

import { CategoryRepository } from '../../../core/repositories/category.repository';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { categoryValidation } from '../validators/category.validator';

const router = Router();

// Dependency Injection
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

// Public routes
router.get(
  '/',
  validateRequest(categoryValidation.listCategories, 'query'),
  categoryController.listCategories,
);

router.get('/hierarchy', categoryController.getCategoryHierarchy);
router.get('/search', categoryController.searchCategories);
router.get('/:id', categoryController.getCategory);
router.get('/:parentId/subcategories', categoryController.getSubcategories);

// Protected routes (Admin only)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(categoryValidation.createCategory),
  categoryController.createCategory,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(categoryValidation.updateCategory),
  categoryController.updateCategory,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  categoryController.deleteCategory,
);

export { router as categoryRoutes };
