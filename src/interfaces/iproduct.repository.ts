import { ProductModel } from '../models';

export interface IProductRepository {
  getById(id: string): Promise<ProductModel | null>;
  getAll(): Promise<ProductModel[]>;
  create(data: ProductModel): Promise<ProductModel>;
  update(id: string, data: Partial<ProductModel>): Promise<ProductModel | null>;
  delete(id: string): Promise<boolean>;
}
