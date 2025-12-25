import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type { CategoryService } from '../../../core/services/category.service';

export class CategoryController {
  constructor(private service: CategoryService) {}

  breadcrumb = async (req: Request, res: Response) => {
    const data = await this.service.getBreadcrumb(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  create = async (req: Request, res: Response) => {
    const category = await this.service.createCategory(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: category });
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
    const data = await this.service.listCategories({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      includeChildren: req.query.include_children === 'true',
      parentId: req.query.parent_id as string | undefined,
      isActive:
        req.query.is_active === 'true'
          ? true
          : req.query.is_active === 'false'
            ? false
            : undefined,
      search: req.query.search as string | undefined,
    });
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  search = async (req: Request, res: Response) => {
    const data = await this.service.searchCategories(req.query.query as string);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  slugPath = async (req: Request, res: Response) => {
    const path = await this.service.getFullSlugPath(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data: { path } });
  };

  subcategories = async (req: Request, res: Response) => {
    const data = await this.service.getSubcategories(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, data });
  };

  update = async (req: Request, res: Response) => {
    const category = await this.service.updateCategory(req.params.id, req.body);
    res.status(StatusCodes.OK).json({ success: true, data: category });
  };
}
