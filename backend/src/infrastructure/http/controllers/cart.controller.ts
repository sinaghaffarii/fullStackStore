import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { CartService } from '../../../core/services/cart.service';

export class CartController {
  constructor(private service: CartService) {}

  addItem = async (req: Request, res: Response) => {
    const cart = await this.service.addItem(req, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: cart });
  };

  clear = async (req: Request, res: Response) => {
    const cart = await this.service.clear(req);
    res.status(StatusCodes.OK).json({ success: true, data: cart });
  };

  getCart = async (req: Request, res: Response) => {
    const cart = await this.service.getCart(req);
    res.status(StatusCodes.OK).json({ success: true, data: cart });
  };

  removeItem = async (req: Request, res: Response) => {
    const cart = await this.service.removeItem(req, req.params.itemId);
    res.status(StatusCodes.OK).json({ success: true, data: cart });
  };

  updateItem = async (req: Request, res: Response) => {
    const cart = await this.service.updateItem(
      req,
      req.params.itemId,
      req.body.quantity,
    );
    res.status(StatusCodes.OK).json({ success: true, data: cart });
  };
}
