import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class UpdateOrderItemDTO {
  @IsString()
  @IsUUID()
  productId: string;

  @IsPositive()
  quantity: number;
}

export class UpdateOrderItemsDTO {
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDTO)
  items?: UpdateOrderItemDTO[];
}
