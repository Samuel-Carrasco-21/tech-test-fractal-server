import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { controllerHandler } from '../errors/handlers';
import { logger } from '../shared/utils';
import { BadRequest, NotFound } from '../errors/utils';
import { CreateProductDTO, UpdateProductDTO } from '../dtos';
import { ProductService } from '../services/product.service';
import { commonSuccessHandler } from '../shared/handlers/commonSuccessHandler';

export class ProductController {
  constructor(private productService: ProductService) {
    this.productService = productService;
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    const log = 'productController:getAllProducts::';
    logger.info(log + 'init');
    try {
      const data = await this.productService.getAllProducts();
      commonSuccessHandler(
        'Productos obtenidos exitosamente',
        log,
        StatusCodes.OK,
        data,
        res
      );
    } catch (error) {
      controllerHandler(error, log, next);
    } finally {
      logger.info(log + 'end');
    }
  }

  public async getProductById(req: Request, res: Response, next: NextFunction) {
    const log = 'productController:getProductById::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del producto es requerido'));
      }
      const data = await this.productService.getProductById(id);
      if (!data) {
        return next(NotFound(`Producto con ID ${id} no encontrado`));
      }
      commonSuccessHandler(
        'Producto encontrado',
        log,
        StatusCodes.OK,
        data,
        res
      );
    } catch (error) {
      controllerHandler(error, log, next);
    } finally {
      logger.info(log + 'end');
    }
  }

  public async createProduct(req: Request, res: Response, next: NextFunction) {
    const log = 'productController:createProduct::';
    logger.info(log + 'init');
    try {
      const dto = req.body as CreateProductDTO;
      const data = await this.productService.createProduct(dto);
      commonSuccessHandler(
        'Producto creado exitosamente',
        log,
        StatusCodes.CREATED,
        data,
        res
      );
    } catch (error) {
      controllerHandler(error, log, next);
    } finally {
      logger.info(log + 'end');
    }
  }

  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    const log = 'productController:updateProduct::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del producto es requerido'));
      }
      const dto = req.body as UpdateProductDTO;
      const data = await this.productService.updateProduct(id, dto);
      if (!data) {
        return next(
          NotFound(`Producto con ID ${id} no encontrado para actualizar`)
        );
      }
      commonSuccessHandler(
        'Producto actualizado exitosamente',
        log,
        StatusCodes.OK,
        data,
        res
      );
    } catch (error) {
      controllerHandler(error, log, next);
    } finally {
      logger.info(log + 'end');
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const log = 'productController:deleteProduct::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del producto es requerido'));
      }
      const success = await this.productService.deleteProduct(id);
      if (!success) {
        return next(
          NotFound(`Producto con ID ${id} no encontrado para eliminar`)
        );
      }
      commonSuccessHandler(
        'Producto eliminado exitosamente',
        log,
        StatusCodes.OK, // O StatusCodes.NO_CONTENT si no se devuelve data
        { success: true },
        res
      );
    } catch (error) {
      controllerHandler(error, log, next);
    } finally {
      logger.info(log + 'end');
    }
  }
}
