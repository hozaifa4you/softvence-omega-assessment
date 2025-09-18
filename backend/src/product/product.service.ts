import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';
import { products } from 'src/db/schemas';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductService {
   constructor(
      @Inject(DB) private readonly db: Database,
      private readonly slugGeneratorService: SlugGeneratorService,
   ) {}

   public async create(createProductDto: CreateProductDto) {
      const productForSku = await this.db.query.products.findFirst({
         where: eq(products.sku, createProductDto.sku),
      });
      if (productForSku) {
         throw new BadRequestException('SKU must be unique');
      }

      const slug = await this.slugGeneratorService.generateUniqueSlug(
         createProductDto.name,
         'products',
         'slug',
      );

      const productData = {
         ...createProductDto,
         slug,
         price: createProductDto.price.toString(),
         offerPrice: createProductDto.offerPrice?.toString(),
         discount: createProductDto.discount?.toString(),
      };

      const returning = await this.db
         .insert(products)
         .values(productData)
         .returning();

      return returning[0];
   }
}
