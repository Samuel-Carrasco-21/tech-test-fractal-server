import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
