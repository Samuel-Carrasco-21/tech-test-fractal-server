import { v4 as uuid } from 'uuid';
import { OrderEntity } from '../entities';
import { OrderItemModel } from './order-item.model';
import { OrderStatusEnum } from '../enums/orders';
import { orderStatusToOrderStatusEnum } from '../shared/utils';
import { ProductModel } from './product.model';

/**
 * @class OrderModel
 * @description Representa un pedido completo con su lógica de negocio asociada.
 *              Es el "Agregado Raíz" (Aggregate Root) del dominio de pedidos.
 */
export class OrderModel {
  id: string;
  orderNumber: string;
  date: Date;
  status: OrderStatusEnum;
  items: OrderItemModel[];
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Partial<OrderEntity>) {
    this.id = entity.id || uuid();
    this.orderNumber = entity.orderNumber || '';
    this.date = entity.date || new Date();
    this.status = entity.status
      ? orderStatusToOrderStatusEnum(entity.status)
      : OrderStatusEnum.PENDING;
    this.items = entity.items?.map(item => new OrderItemModel(item)) || [];
    this.createdAt = entity.createdAt || new Date();
    this.updatedAt = entity.updatedAt || new Date();
  }

  get productCount(): number {
    return this.items.length;
  }

  get finalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  addProduct(product: ProductModel, quantity: number): void {
    if (this.status === OrderStatusEnum.COMPLETED) {
      throw new Error('No se pueden añadir productos a un pedido completado.');
    }

    const existingItem = this.items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = new OrderItemModel({
        productId: product.id,
        orderId: this.id,
        quantity: quantity,
        priceAtOrder: product.unitPrice,
      });
      this.items.push(newItem);
    }
  }

  removeProduct(productId: string): void {
    if (this.status === OrderStatusEnum.COMPLETED) {
      throw new Error('No se pueden quitar productos de un pedido completado.');
    }
    this.items = this.items.filter(item => item.productId !== productId);
  }

  completeOrder(): void {
    this.status = OrderStatusEnum.COMPLETED;
    this.updatedAt = new Date();
  }
}
