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

   @IsInt()
   @IsPositive()
   total: number;
}

export class CreateOrderDto {
   @IsInt()
   @IsPositive()
   amount: number;

   @IsInt()
   @IsPositive()
   customer_id: number;

   @IsArray()
   @IsInt({ each: true })
   @IsPositive({ each: true })
   @IsNotEmpty()
   vendor_ids: number[];

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => CreateOrderItemDto)
   @IsNotEmpty()
   items: CreateOrderItemDto[];
}
