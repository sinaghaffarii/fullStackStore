// product.controller.ts
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
    await this.service.delete(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  };

  getById = async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await this.service.getBySlug(req.params.slug);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  list = async (req: Request, res: Response) => {
    const data = await this.service.list(req.query as any);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  update = async (req: Request, res: Response) => {
    const product = await this.service.update(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: product });
  };

  updateStock = async (req: Request, res: Response) => {
    const { variant_id, stock } = req.body;
    const variant = await this.service.updateStock(variant_id, stock);
    res.status(StatusCodes.OK).json({ success: true, data: variant });
  };
}
