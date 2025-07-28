import { OrderStatusEnum } from '../enums/orders';
import { OrderItemResponseDTO } from './order-item-response.dto';

export class OrderListResponseDTO {
  id: string;
  orderNumber: string;
  date: Date;
  status: OrderStatusEnum;
  productCount: number;
  finalPrice: number;
}

export class SingleOrderResponseDTO extends OrderListResponseDTO {
  items: OrderItemResponseDTO[];
}
