import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { controllerHandler } from '../errors/handlers';
import { logger } from '../shared/utils';
import { BadRequest, NotFound } from '../errors/utils';
import { CreateOrderDTO, UpdateOrderDTO, UpdateOrderItemsDTO } from '../dtos';
import { OrderService } from '../services/order.service';
import { commonSuccessHandler } from '../shared/handlers/commonSuccessHandler';

export class OrderController {
  constructor(private orderService: OrderService) {
    this.orderService = orderService;
  }

  public async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const log = 'orderController:getAllOrders::';
    logger.info(log + 'init');
    try {
      const data = await this.orderService.getAllOrders();
      commonSuccessHandler(
        'Pedidos obtenidos exitosamente',
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

  public async getOrderById(req: Request, res: Response, next: NextFunction) {
    const log = 'orderController:getOrderById::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del pedido es requerido'));
      }
      const data = await this.orderService.getOrderById(id);
      if (!data) {
        return next(NotFound(`Pedido con ID ${id} no encontrado`));
      }
      commonSuccessHandler('Pedido encontrado', log, StatusCodes.OK, data, res);
    } catch (error) {
      controllerHandler(error, log, next);
    } finally {
      logger.info(log + 'end');
    }
  }

  public async createOrder(req: Request, res: Response, next: NextFunction) {
    const log = 'orderController:createOrder::';
    logger.info(log + 'init');
    try {
      const dto = req.body as CreateOrderDTO;
      const data = await this.orderService.createOrder(dto);
      commonSuccessHandler(
        'Pedido creado exitosamente',
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

  public async updateOrder(req: Request, res: Response, next: NextFunction) {
    const log = 'orderController:updateOrder::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del pedido es requerido'));
      }

      const dto = req.body as UpdateOrderItemsDTO;

      if (!dto.orderNumber && !dto.items) {
        return next(
          BadRequest(
            'Se requiere al menos un campo para actualizar (orderNumber o items).'
          )
        );
      }

      const data = await this.orderService.updateOrder(id, dto);

      if (!data) {
        return next(
          NotFound(`Pedido con ID ${id} no encontrado o no se pudo actualizar`)
        );
      }

      commonSuccessHandler(
        'Pedido actualizado exitosamente',
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

  public async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const log = 'orderController:updateOrderStatus::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del pedido es requerido'));
      }
      const dto = req.body as UpdateOrderDTO;
      const data = await this.orderService.updateOrderStatus(id, dto);
      if (!data) {
        return next(
          NotFound(`Pedido con ID ${id} no encontrado para actualizar`)
        );
      }
      commonSuccessHandler(
        'Estado del pedido actualizado exitosamente',
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

  public async deleteOrder(req: Request, res: Response, next: NextFunction) {
    const log = 'orderController:deleteOrder::';
    logger.info(log + 'init');
    try {
      const { id } = req.params;
      if (!id) {
        return next(BadRequest('El ID del pedido es requerido'));
      }
      const success = await this.orderService.deleteOrder(id);
      if (!success) {
        return next(
          NotFound(`Pedido con ID ${id} no encontrado para eliminar`)
        );
      }
      commonSuccessHandler(
        'Pedido eliminado exitosamente',
        log,
        StatusCodes.OK,
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
