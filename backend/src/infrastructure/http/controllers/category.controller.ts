import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { CategoryService } from '../../../core/services/category.service';

export class CategoryController {
  constructor(private service: CategoryService) {}

  create = async (req: Request, res: Response) => {
    const cat = await this.service.createCategory(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: cat });
  };

  delete = async (req: Request, res: Response) => {
    await this.service.deleteCategory(req.params.id);
    res.status(StatusCodes.OK).json({ success: true });
  };

  get = async (req: Request, res: Response) => {
    const data = await this.service.getCategoryById(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  hierarchy = async (_req: Request, res: Response) => {
    const data = await this.service.getCategoryHierarchy();
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  list = async (req: Request, res: Response) => {
    const data = await this.service.listCategories(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20,
      req.query.include_children === 'true',
    );
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  search = async (req: Request, res: Response) => {
    const data = await this.service.searchCategories(req.query.query as string);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  subcategories = async (req: Request, res: Response) => {
    const data = await this.service.getSubcategories(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  update = async (req: Request, res: Response) => {
    const cat = await this.service.updateCategory(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: cat });
  };
}
