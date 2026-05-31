import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validation.middleware';
import { CartController } from '../controllers/cart.controller';
import { CartService } from '../services/cart.service';
import { cartValidation } from '../validators/cart.validator';

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
