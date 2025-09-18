import { ProductStatus } from 'src/db/schemas';

export class CreateProductDto {
   name: string;
   description: string;
   price: number;
   offerPrice?: number;
   discount?: number;
   sku: string;
   stock: number;
   status?: ProductStatus;
   vendor_id: number;
   category_id: number;
}
