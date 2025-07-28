import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDTO {
  @IsString()
  @IsUUID()
  productId: string;

  @IsPositive()
  quantity: number;
}

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items: CreateOrderItemDTO[];
}
