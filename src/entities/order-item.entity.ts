export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtOrder: number;
  createdAt: Date;
}
