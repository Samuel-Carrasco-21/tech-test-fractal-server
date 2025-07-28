import { logger } from '../shared/utils';
import { repositoryHandler } from '../errors/handlers';
import { IProductRepository } from '../interfaces';
import { prisma } from '../config';
import { ProductEntity } from '../entities';
import { ProductModel } from '../models';

export class ProductRepository implements IProductRepository {
  public async getById(id: string): Promise<ProductModel | null> {
    const log = 'productRepository:getById::';
    logger.info(log + 'init');
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        logger.warn(log + `Producto con id: ${id} no encontrado.`);
        return null;
      }

      const productEntity: ProductEntity = {
        id: product.id,
        name: product.name,
        unitPrice: product.unitPrice.toNumber(),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      logger.info(log + `Producto obtenido con id: ${id}`);
      return new ProductModel(productEntity);
    } catch (error) {
      repositoryHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async getAll(): Promise<ProductModel[]> {
    const log = 'productRepository:getAll::';
    logger.info(log + 'init');
    try {
      const products = await prisma.product.findMany();
      const productModels = products.map(product => {
        const entity: ProductEntity = {
          id: product.id,
          name: product.name,
          unitPrice: product.unitPrice.toNumber(),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
        return new ProductModel(entity);
      });

      logger.info(log + `Se obtuvieron ${productModels.length} productos.`);
      return productModels;
    } catch (error) {
      repositoryHandler(error, log);
      return [];
    } finally {
      logger.info(log + 'end');
    }
  }

  public async create(data: ProductModel): Promise<ProductModel | null> {
    const log = 'productRepository:create::';
    logger.info(log + 'init');
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: data.name,
          unitPrice: data.unitPrice,
        },
      });

      const productEntity: ProductEntity = {
        id: newProduct.id,
        name: newProduct.name,
        unitPrice: newProduct.unitPrice.toNumber(),
        createdAt: newProduct.createdAt,
        updatedAt: newProduct.updatedAt,
      };

      logger.info(log + `Producto creado con id: ${newProduct.id}`);
      return new ProductModel(productEntity);
    } catch (error) {
      repositoryHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async update(
    id: string,
    data: Partial<ProductModel>
  ): Promise<ProductModel | null> {
    const log = 'productRepository:update::';
    logger.info(log + 'init');
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          unitPrice: data.unitPrice,
        },
      });
      const productEntity: ProductEntity = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        unitPrice: updatedProduct.unitPrice.toNumber(),
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
      };
      logger.info(log + `Producto actualizado con id: ${id}`);
      return new ProductModel(productEntity);
    } catch (error) {
      repositoryHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async delete(id: string): Promise<boolean> {
    const log = 'productRepository:delete::';
    logger.info(log + 'init');
    try {
      await prisma.product.delete({ where: { id } });
      logger.info(log + `Producto eliminado con id: ${id}`);
      return true;
    } catch (error) {
      repositoryHandler(error, log);
      return false;
    } finally {
      logger.info(log + 'end');
    }
  }
}
