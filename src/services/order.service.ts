import { serviceHandler } from '../errors/handlers';
import { logger } from '../shared/utils';
import {
  OrderListResponseDTO,
  SingleOrderResponseDTO,
  OrderItemResponseDTO,
  CreateOrderDTO,
  UpdateOrderDTO,
  UpdateOrderItemsDTO,
} from '../dtos';
import { IOrderRepository, IProductRepository } from '../interfaces';
import { OrderModel } from '../models';
import { OrderStatusEnum } from '../enums/orders';

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  public async getAllOrders(): Promise<OrderListResponseDTO[]> {
    const log = 'orderService:getAllOrders::';
    logger.info(log + 'init');
    try {
      const orderModels = await this.orderRepository.getAll();
      logger.info(log + `Se obtuvieron ${orderModels.length} pedidos.`);

      // Usamos los getters del Model para los campos calculados
      return orderModels.map(model => ({
        id: model.id,
        orderNumber: model.orderNumber,
        date: model.date,
        status: model.status,
        productCount: model.productCount,
        finalPrice: model.finalPrice,
      }));
    } catch (error) {
      serviceHandler(error, log);
      return [];
    } finally {
      logger.info(log + 'end');
    }
  }

  public async getOrderById(
    id: string
  ): Promise<SingleOrderResponseDTO | null> {
    const log = 'orderService:getOrderById::';
    logger.info(log + 'init');
    try {
      const orderModel = await this.orderRepository.getById(id);
      if (!orderModel) {
        logger.warn(log + `Pedido con id ${id} no encontrado.`);
        return null;
      }

      // Mapeamos los ítems a su DTO de respuesta
      const itemDTOs: OrderItemResponseDTO[] = [];
      for (const item of orderModel.items) {
        // Este es un punto clave de orquestación: enriquecemos el DTO
        const product = await this.productRepository.getById(item.productId);
        itemDTOs.push({
          productId: item.productId,
          productName: product ? product.name : 'Producto no encontrado',
          quantity: item.quantity,
          priceAtOrder: item.priceAtOrder,
          totalPrice: item.totalPrice, // Usamos el getter del OrderItemModel
        });
      }

      logger.info(log + `Pedido obtenido con id: ${id}`);
      return {
        id: orderModel.id,
        orderNumber: orderModel.orderNumber,
        date: orderModel.date,
        status: orderModel.status,
        productCount: orderModel.productCount,
        finalPrice: orderModel.finalPrice,
        items: itemDTOs,
      };
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async createOrder(
    dto: CreateOrderDTO
  ): Promise<SingleOrderResponseDTO | null> {
    const log = 'orderService:createOrder::';
    logger.info(log + 'init');
    try {
      // 1. Iniciar un modelo de pedido vacío
      const orderModel = new OrderModel({ orderNumber: dto.orderNumber });

      // 2. Orquestar la adición de productos al modelo
      for (const itemDto of dto.items) {
        const product = await this.productRepository.getById(itemDto.productId);
        if (!product) {
          throw new Error(`Producto con ID ${itemDto.productId} no existe.`);
        }
        // Usamos la lógica de negocio del propio modelo para añadir productos
        orderModel.addProduct(product, itemDto.quantity);
      }

      // 3. Persistir el modelo de pedido completo
      const createdOrder = await this.orderRepository.create(orderModel);
      logger.info(log + `Pedido creado con id: ${createdOrder.id}`);

      // 4. Devolver la vista detallada del pedido recién creado
      return this.getOrderById(createdOrder.id);
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async updateOrder(
    id: string,
    dto: UpdateOrderItemsDTO
  ): Promise<SingleOrderResponseDTO | null> {
    const log = 'orderService:updateOrder::';
    logger.info(log + 'init');
    try {
      const orderModel = await this.orderRepository.getById(id);
      if (!orderModel) {
        logger.warn(log + `Pedido con id ${id} no encontrado para actualizar.`);
        return null;
      }

      if (orderModel.status === OrderStatusEnum.COMPLETED) {
        throw new Error(
          'No se puede modificar un pedido que ya ha sido completado.'
        );
      }
      if (typeof dto.orderNumber === 'string') {
        orderModel.orderNumber = dto.orderNumber;
      }

      if (dto.items) {
        orderModel.items = [];

        for (const itemDto of dto.items) {
          const product = await this.productRepository.getById(
            itemDto.productId
          );
          if (!product) {
            throw new Error(
              `Producto con ID ${itemDto.productId} no existe y no se puede añadir al pedido.`
            );
          }
          orderModel.addProduct(product, itemDto.quantity);
        }
      }

      const updatedOrder = await this.orderRepository.update(id, orderModel);

      if (!updatedOrder) {
        throw new Error(
          'La actualización del pedido falló en la capa de persistencia.'
        );
      }

      logger.info(log + `Pedido actualizado con id: ${id}`);
      return this.getOrderById(updatedOrder.id);
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async updateOrderStatus(
    id: string,
    dto: UpdateOrderDTO
  ): Promise<SingleOrderResponseDTO | null> {
    const log = 'orderService:updateOrderStatus::';
    logger.info(log + 'init');
    try {
      const orderModel = await this.orderRepository.getById(id);
      if (!orderModel) {
        logger.warn(log + `Pedido con id ${id} no encontrado para actualizar.`);
        return null;
      }

      // Lógica de negocio: Validar si el estado puede cambiar
      if (orderModel.status === 'COMPLETED' && dto.status !== 'COMPLETED') {
        throw new Error('Un pedido completado no puede cambiar su estado.');
      }
      orderModel.status = dto.status;

      const updatedOrder = await this.orderRepository.update(id, orderModel);
      logger.info(log + `Estado del pedido ${id} actualizado a ${dto.status}`);
      return this.getOrderById(updatedOrder.id);
    } catch (error) {
      serviceHandler(error, log);
      return null;
    } finally {
      logger.info(log + 'end');
    }
  }

  public async deleteOrder(id: string): Promise<boolean> {
    const log = 'orderService:deleteOrder::';
    logger.info(log + 'init');
    try {
      const success = await this.orderRepository.delete(id);
      const successMessage =
        log +
        `Intento de eliminación para pedido con id: ${id} resultó en: ${success}`;
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
