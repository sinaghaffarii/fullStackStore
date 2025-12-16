import { Router } from 'express';

import { CartService } from '../../../core/services/cart.service';
import { CartController } from '../controllers/cart.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { cartValidation } from '../validators';

const router = Router();
const controller = new CartController(new CartService());

router.get('/', controller.getCart);

router.post('/', validateRequest(cartValidation.addItem), controller.addItem);

router.patch(
  '/:itemId',
  validateRequest(cartValidation.updateItem),
  controller.updateItem,
);

router.delete('/:itemId', controller.removeItem);

router.delete('/', controller.clear);

export { router as cartRoutes };
