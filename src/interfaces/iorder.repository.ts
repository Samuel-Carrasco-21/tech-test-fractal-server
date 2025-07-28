import { OrderModel } from '../models';

export interface IOrderRepository {
  getById(id: string): Promise<OrderModel | null>;
  getAll(): Promise<OrderModel[]>;
  create(data: OrderModel): Promise<OrderModel>;
  update(id: string, data: OrderModel): Promise<OrderModel | null>;
  delete(id: string): Promise<boolean>;
}
