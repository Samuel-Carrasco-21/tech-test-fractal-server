import { OrderStatus } from '@prisma/client';
import { OrderStatusEnum } from '../../enums/orders';

export const orderStatusToOrderStatusEnum = (oderStatus: OrderStatus) => {
  switch (oderStatus) {
    case OrderStatus.PENDING:
      return OrderStatusEnum.PENDING;
    case OrderStatus.IN_PROGRESS:
      return OrderStatusEnum.IN_PROGRESS;
    case OrderStatus.COMPLETED:
      return OrderStatusEnum.COMPLETED;
    default:
      throw new Error(`Estado de pedido desconocido: ${oderStatus}`);
  }
};
