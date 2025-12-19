import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { BrandService } from '../../../core/services/brand.service';

export class BrandController {
  constructor(private service: BrandService) {}

  create = async (req: Request, res: Response) => {
    const brand = await this.service.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: brand });
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
    const result = await this.service.list(req.query);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  };

  update = async (req: Request, res: Response) => {
    const brand = await this.service.update(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: brand });
  };
}
