import { v4 as uuid } from 'uuid';
import { OrderItemEntity } from '../entities';

export class OrderItemModel {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtOrder: number;
  createdAt: Date;

  constructor(entity: Partial<OrderItemEntity>) {
    this.id = entity.id || uuid();
    this.orderId = entity.orderId || '';
    this.productId = entity.productId || '';
    this.quantity = entity.quantity ?? 1;
    this.priceAtOrder = entity.priceAtOrder ?? 0;
    this.createdAt = entity.createdAt || new Date();
  }

  get totalPrice(): number {
    return this.quantity * this.priceAtOrder;
  }
}
