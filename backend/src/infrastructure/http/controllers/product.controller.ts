import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ProductService,
  CreateProductDTO,
  ProductFilters,
} from '../../../core/services/product.service';
import { AppError } from '../../../shared/errors/app-error';
import { sendResponse } from '../../../shared/utils/response-handler';

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: CreateProductDTO = req.body;

      const product = await this.productService.createProduct(productData);

      sendResponse(res, StatusCodes.CREATED, {
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      throw error;
    }
  };

  getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const product = await this.productService.getProductById(id);

      sendResponse(res, StatusCodes.OK, {
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      throw error;
    }
  };

  listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        category_id,
        min_price,
        max_price,
        in_stock,
        search,
        page = '1',
        limit = '10',
      } = req.query;

      const filters: ProductFilters = {
        category_id: category_id as string,
        min_price: min_price ? parseFloat(min_price as string) : undefined,
        max_price: max_price ? parseFloat(max_price as string) : undefined,
        in_stock: in_stock === 'true',
        search: search as string,
      };

      // Parse attributes from query string
      if (req.query.attributes) {
        try {
          filters.attributes = JSON.parse(req.query.attributes as string);
        } catch (error) {
          throw new AppError(
            'Invalid attributes format',
            StatusCodes.BAD_REQUEST,
          );
        }
      }

      const result = await this.productService.listProducts(
        filters,
        parseInt(page as string),
        parseInt(limit as string),
      );

      sendResponse(res, StatusCodes.OK, {
        message: 'Products retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await this.productService.updateProduct(id, updateData);

      sendResponse(res, StatusCodes.OK, {
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      throw error;
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await this.productService.deleteProduct(id);

      sendResponse(res, StatusCodes.OK, {
        message: 'Product deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  };

  updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== 'number' || quantity < 0) {
        throw new AppError(
          'Valid quantity is required',
          StatusCodes.BAD_REQUEST,
        );
      }

      const product = await this.productService.updateStock(id, quantity);

      sendResponse(res, StatusCodes.OK, {
        message: 'Stock updated successfully',
        data: product,
      });
    } catch (error) {
      throw error;
    }
  };

  getProductsByCategory = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { categoryId } = req.params;
      const { page = '1', limit = '10' } = req.query;

      const result = await this.productService.getProductsByCategory(
        categoryId,
        parseInt(page as string),
        parseInt(limit as string),
      );

      sendResponse(res, StatusCodes.OK, {
        message: 'Products retrieved successfully',
        data: result,
      });
    } catch (error) {
      throw error;
    }
  };
}
