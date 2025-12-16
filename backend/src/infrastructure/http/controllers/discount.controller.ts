import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { DiscountService } from '../../../core/services/discount.service';

export class DiscountController {
  constructor(private service: DiscountService) {}

  banners = async (_req: Request, res: Response) => {
    const discounts = await this.service.getActiveBanners();
    res.status(StatusCodes.OK).json({ success: true, data: discounts });
  };

  create = async (req: Request, res: Response) => {
    const discount = await this.service.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: discount });
  };

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res.status(StatusCodes.OK).json({ success: true });
  };

  get = async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  list = async (req: Request, res: Response) => {
    const data = await this.service.list(req.query as any);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  toggle = async (req: Request, res: Response) => {
    const discount = await this.service.toggleActive(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data: discount });
  };

  update = async (req: Request, res: Response) => {
    const discount = await this.service.update(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: discount });
  };
}
