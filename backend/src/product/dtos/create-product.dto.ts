import {
   IsEnum,
   IsInt,
   IsNumber,
   IsOptional,
   IsPositive,
   IsString,
   Length,
} from 'class-validator';
import type { ProductStatus } from 'src/db/schemas';

export class CreateProductDto {
   @IsString()
   @Length(5, 255)
   name: string;

   @IsString()
   @Length(10, 1000)
   description: string;

   @IsNumber({ maxDecimalPlaces: 2 })
   @IsPositive()
   price: number;

   @IsOptional()
   @IsNumber({ maxDecimalPlaces: 2 })
   @IsPositive()
   offerPrice?: number;

   @IsOptional()
   @IsNumber({ maxDecimalPlaces: 2 })
   @IsPositive()
   discount?: number;

   @IsString()
   @Length(8, 16)
   sku: string;

   @IsInt()
   @IsPositive()
   stock: number;

   @IsOptional()
   @IsEnum(['active', 'inactive', 'out_of_stock'], {
      message:
         'Invalid product status. Must be one of: active, inactive, out_of_stock',
   })
   status?: ProductStatus;

   @IsInt()
   @IsPositive()
   vendor_id: number;

   @IsInt()
   @IsPositive()
   category_id: number;
}
