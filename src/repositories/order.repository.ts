import { logger } from '../shared/utils';
import { repositoryHandler } from '../errors/handlers';
import { prisma } from '../config';
import { OrderEntity } from '../entities';
import { IOrderRepository } from '../interfaces';
import { OrderModel } from '../models';

export class OrderRepository implements IOrderRepository {
  public async getById(id: string): Promise<OrderModel | null> {
    const log = 'orderRepository:getById::';
    logger.info(log + 'init');
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) {
        logger.warn(log + `Pedido con id: ${id} no encontrado.`);
        return null;
      }

      const orderEntity: OrderEntity = {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.date,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map(item => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtOrder: item.priceAtOrder.toNumber(),
          createdAt: item.createdAt,
        })),
      };

      logger.info(log + `Pedido obtenido con id: ${id}`);
      return new OrderModel(orderEntity);
    } catch (error) {
      repositoryHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async getAll(): Promise<OrderModel[]> {
    const log = 'orderRepository:getAll::';
    logger.info(log + 'init');
    try {
      const orders = await prisma.order.findMany({ include: { items: true } });
      const orderModels = orders.map(order => {
        const entity: OrderEntity = {
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.date,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items.map(item => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder.toNumber(),
            createdAt: item.createdAt,
          })),
        };
        return new OrderModel(entity);
      });
      logger.info(log + `Se obtuvieron ${orderModels.length} pedidos.`);
      return orderModels;
    } catch (error) {
      repositoryHandler(error, log);
      return [];
    } finally {
      logger.info(log + 'end');
    }
  }

  public async create(data: OrderModel): Promise<OrderModel | null> {
    const log = 'orderRepository:create::';
    logger.info(log + 'init');
    try {
      const newOrderId = await prisma.$transaction(async tx => {
        const order = await tx.order.create({
          data: {
            orderNumber: data.orderNumber,
            date: data.date,
            status: data.status,
          },
        });
        if (data.items.length > 0) {
          await tx.orderItem.createMany({
            data: data.items.map(item => ({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              priceAtOrder: item.priceAtOrder,
            })),
          });
        }
        return order.id;
      });

      logger.info(log + `Pedido creado con id: ${newOrderId}`);
      return this.getById(newOrderId);
    } catch (error) {
      repositoryHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async update(
    id: string,
    data: OrderModel
  ): Promise<OrderModel | null> {
    const log = 'orderRepository:update::';
    logger.info(log + 'init');
    try {
      const updatedOrderId = await prisma.$transaction(async tx => {
        await tx.order.update({
          where: { id },
          data: {
            status: data.status,
            orderNumber: data.orderNumber,
            updatedAt: new Date(),
          },
        });
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        if (data.items.length > 0) {
          await tx.orderItem.createMany({
            data: data.items.map(item => ({
              orderId: id,
              productId: item.productId,
              quantity: item.quantity,
              priceAtOrder: item.priceAtOrder,
            })),
          });
        }
        return id;
      });
      logger.info(log + `Pedido actualizado con id: ${updatedOrderId}`);
      return this.getById(updatedOrderId);
    } catch (error) {
      repositoryHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async delete(id: string): Promise<boolean> {
    const log = 'orderRepository:delete::';
    logger.info(log + 'init');
    try {
      await prisma.order.delete({ where: { id } });
      logger.info(log + `Pedido eliminado con id: ${id}`);
      return true;
    } catch (error) {
      repositoryHandler(error, log);
      return false;
    } finally {
      logger.info(log + 'end');
    }
  }
}
