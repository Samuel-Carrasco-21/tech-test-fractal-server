import { OrderStatus } from '@prisma/client';
import { OrderItemEntity } from './order-item.entity';

export interface OrderEntity {
  id: string;
  orderNumber: string;
  date: Date;
  status: OrderStatus;
  items: OrderItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}
