import { Router } from 'express';

import { CategoryRepository } from '../../../core/repositories/category.repository';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { categoryValidation } from '../validators';

const router = Router();

/* ✅ Dependency Injection */
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const controller = new CategoryController(categoryService);

router.get(
  '/',
  validateRequest(categoryValidation.list, 'query'),
  controller.list,
);

router.get('/hierarchy', controller.hierarchy);
router.get('/:id/subcategories', controller.subcategories);
router.get('/:id', controller.get);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(categoryValidation.create),
  controller.create,
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  validateRequest(categoryValidation.update),
  controller.update,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  controller.delete,
);

export { router as categoryRoutes };
