import {
   BadRequestException,
   Inject,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';
import { categories, products } from 'src/db/schemas';
import { eq } from 'drizzle-orm';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
   constructor(
      @Inject(DB) private readonly db: Database,
      private readonly slugGeneratorService: SlugGeneratorService,
   ) {}

   public async findAll() {
      const allProducts = await this.db.query.products.findMany();
      return allProducts;
   }

   public async create(createProductDto: CreateProductDto) {
      const category = await this.db.query.categories.findFirst({
         where: eq(categories.id, createProductDto.category_id),
      });
      if (!category) {
         throw new BadRequestException('Invalid category_id');
      }

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

   public async update(slug: string, updateProductDto: UpdateProductDto) {
      const product = await this.db.query.products.findFirst({
         where: eq(products.slug, slug),
      });
      if (!product) {
         throw new NotFoundException('Product not found');
      }

      if (updateProductDto.category_id) {
         const category = await this.db.query.categories.findFirst({
            where: eq(categories.id, updateProductDto.category_id),
         });
         if (!category) {
            throw new BadRequestException('Invalid category_id');
         }
      }

      if (updateProductDto.sku) {
         const productForSku = await this.db.query.products.findFirst({
            where: eq(products.sku, updateProductDto.sku),
         });
         if (productForSku) {
            throw new BadRequestException('SKU must be unique');
         }
      }

      delete updateProductDto.vendor_id;

      const data = {
         ...updateProductDto,
         price: updateProductDto.price
            ? updateProductDto.price.toString()
            : product.price,
         offerPrice: updateProductDto.offerPrice
            ? updateProductDto.offerPrice.toString()
            : product.offerPrice,
         discount: updateProductDto.discount
            ? updateProductDto.discount.toString()
            : product.discount,
      };

      const returning = await this.db
         .update(products)
         .set(data)
         .where(eq(products.slug, slug))
         .returning();

      return returning[0];
   }

   public async findOne(slug: string) {
      const product = await this.db.query.products.findFirst({
         where: eq(products.slug, slug),
      });
      if (!product) {
         throw new NotFoundException('Product not found');
      }

      return product;
   }

   public async delete(slug: string) {
      const product = await this.db.query.products.findFirst({
         where: eq(products.slug, slug),
      });
      if (!product) {
         throw new NotFoundException('Product not found');
      }

      await this.db.delete(products).where(eq(products.slug, slug));

      return { message: 'Product deleted successfully' };
   }
}
