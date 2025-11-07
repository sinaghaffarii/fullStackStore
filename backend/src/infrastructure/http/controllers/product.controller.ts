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

      console.log('Creating product with data:', productData);
      console.log('User making request:', req.user);

      const product = await this.productService.createProduct(productData);

      sendResponse(res, StatusCodes.CREATED, {
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
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

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(
        100,
        Math.max(1, parseInt(limit as string) || 10),
      );

      const filters: ProductFilters = {
        category_id: category_id as string,
        min_price: min_price ? parseFloat(min_price as string) : undefined,
        max_price: max_price ? parseFloat(max_price as string) : undefined,
        in_stock: in_stock === 'true',
        search: search as string,
      };

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
        pageNum,
        limitNum,
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

      if (
        typeof quantity !== 'number' ||
        quantity < 0 ||
        !Number.isInteger(quantity)
      ) {
        throw new AppError(
          'Valid positive integer quantity is required',
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
