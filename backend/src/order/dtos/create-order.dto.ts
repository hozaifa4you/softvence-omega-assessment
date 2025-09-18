import {
   IsArray,
   IsInt,
   IsNotEmpty,
   IsPositive,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
   @IsInt()
   @IsPositive()
   product_id: number;

   @IsInt()
   @IsPositive()
   qty: number;
}

export class CreateOrderDto {
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => CreateOrderItemDto)
   @IsNotEmpty()
   items: CreateOrderItemDto[];
}
