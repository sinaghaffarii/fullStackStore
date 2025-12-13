import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { ProductService } from '../../../core/services/product.service';

export class ProductController {
  constructor(private service: ProductService) {}

  create = async (req: Request, res: Response) => {
    const product = await this.service.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: product });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.delete(id);
    res.status(StatusCodes.OK).json({ success: true });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.service.getById(id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  getBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  list = async (req: Request, res: Response) => {
    const data = await this.service.list(req.query as any);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.service.update(id, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: product });
  };

  updateStock = async (req: Request, res: Response) => {
    const { variant_id: variantId, stock } = req.body;
    const variant = await this.service.updateStock(variantId, stock);
    res.status(StatusCodes.OK).json({ success: true, data: variant });
  };
}
