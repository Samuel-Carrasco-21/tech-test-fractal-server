import { v4 as uuid } from 'uuid';
import { ProductEntity } from '../entities';

export class ProductModel {
  id: string;
  name: string;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Partial<ProductEntity>) {
    this.id = entity.id || uuid();
    this.name = entity.name || 'Producto sin nombre';
    this.unitPrice = entity.unitPrice ?? 0;
    this.createdAt = entity.createdAt || new Date();
    this.updatedAt = entity.updatedAt || new Date();
  }
}
