/* eslint-disable @typescript-eslint/naming-convention */
import type { Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from '../../infrastructure/database/models';
import { AppError } from '../../shared/errors/app-error';

export class CartService {
  async addItem(req: Request, body: { variant_id: string; quantity?: number }) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
    const { variant_id, quantity = 1 } = body;

    const variant = await ProductVariant.findByPk(variant_id);
    if (!variant || !variant.is_active) {
      throw new AppError('Variant not found', StatusCodes.NOT_FOUND);
    }
    if (variant.stock < quantity) {
      throw new AppError('Out of stock', StatusCodes.BAD_REQUEST);
    }

    const cart = await this.getOrCreateCart(userId);

    const [item, created] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, variant_id },
      defaults: {
        cart_id: cart.id,
        variant_id,
        quantity,
      } as any,
    });

    if (!created) {
      const newQty = item.quantity + quantity;
      if (variant.stock < newQty) {
        throw new AppError('Out of stock', StatusCodes.BAD_REQUEST);
      }
      await item.update({ quantity: newQty });
    }

    return this.getCart(req);
  }

  async clear(req: Request) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);

    const cart = await this.getOrCreateCart(userId);
    await CartItem.destroy({ where: { cart_id: cart.id } });
    return this.getCart(req);
  }

  async getCart(req: Request) {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const cart = await this.getOrCreateCart(userId);
    const items = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [
        {
          model: ProductVariant,
          as: 'variant',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug'],
            },
          ],
        },
      ],
    });

    const total_items = items.reduce((s, i) => s + i.quantity, 0);
    const total_price = items.reduce(
      (s, i) => s + i.quantity * (i.variant?.price || 0),
      0,
    );

    return { id: cart.id, items, total_items, total_price };
  }

  async removeItem(req: Request, itemId: string) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);

    const cart = await this.getOrCreateCart(userId);
    await CartItem.destroy({ where: { id: itemId, cart_id: cart.id } });
    return this.getCart(req);
  }

  async updateItem(req: Request, itemId: string, quantity: number) {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);

    const cart = await this.getOrCreateCart(userId);
    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
      include: [{ model: ProductVariant, as: 'variant' }],
    });
    if (!item) throw new AppError('Item not found', StatusCodes.NOT_FOUND);

    if (!item.variant?.is_active) {
      throw new AppError('Variant inactive', StatusCodes.BAD_REQUEST);
    }
    if (item.variant.stock < quantity) {
      throw new AppError('Out of stock', StatusCodes.BAD_REQUEST);
    }

    await item.update({ quantity });
    return this.getCart(req);
  }

  private async getOrCreateCart(userId: string) {
    const [cart] = await Cart.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
      } as any,
    });
    return cart;
  }
}
