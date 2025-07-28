import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatusEnum } from '../enums/orders';

export class UpdateOrderDTO {
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;
}
