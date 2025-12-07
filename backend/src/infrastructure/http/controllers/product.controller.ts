import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

import type {
  CreateProductDTO,
  ProductFilters,
  ProductService,
} from '../../../core/services/product.service';

import { AppError } from '../../../shared/errors/app-error';
import { sendResponse } from '../../../shared/utils/response-handler';

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = async (req: Request, res: Response): Promise<void> => {
    const productData: CreateProductDTO = req.body;
    const product = await this.productService.createProduct(productData);

    sendResponse(res, StatusCodes.CREATED, {
      message: 'Product created successfully',
      data: product,
    });
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.productService.deleteProduct(id);

    sendResponse(res, StatusCodes.OK, {
      message: 'Product deleted successfully',
    });
  };

  getProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);

    sendResponse(res, StatusCodes.OK, {
      message: 'Product retrieved successfully',
      data: product,
    });
  };

  getProductsByCategory = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { categoryId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const result = await this.productService.getProductsByCategory(
      categoryId,
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
    );

    sendResponse(res, StatusCodes.OK, {
      message: 'Products retrieved successfully',
      data: result,
    });
  };

  listProducts = async (req: Request, res: Response): Promise<void> => {
    const {
      category_id: categoryId,
      min_price: minPrice,
      max_price: maxPrice,
      in_stock: inStock,
      search,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 10),
    );

    const filters: ProductFilters = {
      category_id: categoryId as string,
      min_price: minPrice ? parseFloat(minPrice as string) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice as string) : undefined,
      in_stock: inStock === 'true',
      search: search as string,
    };

    if (req.query.attributes) {
      try {
        filters.attributes = JSON.parse(req.query.attributes as string);
      } catch {
        throw new AppError('Invalid attributes format', {
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }
    }

    const result = await this.productService.listProducts(
      filters,
      pageNum,
      limitNum,
    );

    sendResponse(res, StatusCodes.OK, {
      message: 'Products retrieved successfully',
      data: result,
    });
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;
    const product = await this.productService.updateProduct(id, updateData);

    sendResponse(res, StatusCodes.OK, {
      message: 'Product updated successfully',
      data: product,
    });
  };

  updateStock = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (
      typeof quantity !== 'number' ||
      quantity < 0 ||
      !Number.isInteger(quantity)
    ) {
      throw new AppError('Valid positive integer quantity is required', {
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const product = await this.productService.updateStock(id, quantity);

    sendResponse(res, StatusCodes.OK, {
      message: 'Stock updated successfully',
      data: product,
    });
  };
}
