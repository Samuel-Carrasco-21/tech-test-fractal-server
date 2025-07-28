import { serviceHandler } from '../errors/handlers';
import { logger } from '../shared/utils';
import {
  ProductResponseDTO,
  CreateProductDTO,
  UpdateProductDTO,
} from '../dtos';
import { IProductRepository } from '../interfaces';
import { ProductModel } from '../models';

export class ProductService {
  constructor(private productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public async getAllProducts(): Promise<ProductResponseDTO[]> {
    const log = 'productService:getAllProducts::';
    logger.info(log + 'init');
    try {
      const productModels = await this.productRepository.getAll();
      logger.info(log + `Se obtuvieron ${productModels.length} productos.`);

      return productModels.map(model => ({
        id: model.id,
        name: model.name,
        unitPrice: model.unitPrice,
      }));
    } catch (error) {
      serviceHandler(error, log);
      return [];
    } finally {
      logger.info(log + 'end');
    }
  }

  public async getProductById(id: string): Promise<ProductResponseDTO | null> {
    const log = 'productService:getProductById::';
    logger.info(log + 'init');
    try {
      const model = await this.productRepository.getById(id);
      if (!model) {
        logger.warn(log + `Producto con id ${id} no encontrado.`);
        return null;
      }
      logger.info(log + `Producto obtenido con id: ${id}`);
      return {
        id: model.id,
        name: model.name,
        unitPrice: model.unitPrice,
      };
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async createProduct(
    dto: CreateProductDTO
  ): Promise<ProductResponseDTO | null> {
    const log = 'productService:createProduct::';
    logger.info(log + 'init');
    try {
      const productModel = new ProductModel({
        name: dto.name,
        unitPrice: dto.unitPrice,
      });

      const createdProduct = await this.productRepository.create(productModel);
      logger.info(log + `Producto creado con id: ${createdProduct.id}`);

      return {
        id: createdProduct.id,
        name: createdProduct.name,
        unitPrice: createdProduct.unitPrice,
      };
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async updateProduct(
    id: string,
    dto: UpdateProductDTO
  ): Promise<ProductResponseDTO | null> {
    const log = 'productService:updateProduct::';
    logger.info(log + 'init');
    try {
      const updatedProduct = await this.productRepository.update(id, dto);
      if (!updatedProduct) {
        logger.warn(
          log + `Producto con id ${id} no encontrado para actualizar.`
        );
        return null;
      }
      logger.info(log + `Producto actualizado con id: ${id}`);
      return {
        id: updatedProduct.id,
        name: updatedProduct.name,
        unitPrice: updatedProduct.unitPrice,
      };
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const log = 'productService:deleteProduct::';
    logger.info(log + 'init');
    try {
      const success = await this.productRepository.delete(id);
      const successMessage =
        log +
        `Intento de eliminación para producto con id: ${id} resultó en: ${success}`;
      logger.info(successMessage);
      return success;
    } catch (error) {
      serviceHandler(error, log);
      return false;
    } finally {
      logger.info(log + 'end');
    }
  }
}
