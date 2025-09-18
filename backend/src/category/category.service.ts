import {
   BadRequestException,
   Inject,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';
import { categories, products } from 'src/db/schemas';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoryService {
   constructor(
      @Inject(DB) private readonly db: Database,
      private readonly slugGeneratorService: SlugGeneratorService,
   ) {}

   public async create(createCategoryDto: CreateCategoryDto) {
      const slug = await this.slugGeneratorService.generateUniqueSlug(
         createCategoryDto.name,
         'categories',
         'slug',
      );

      const returning = await this.db
         .insert(categories)
         .values({ ...createCategoryDto, slug })
         .returning();

      return returning[0];
   }

   public async findAll() {
      return this.db.query.categories.findMany();
   }

   public async findOne(slug: string) {
      const category = await this.db.query.categories.findFirst({
         where: eq(categories.slug, slug),
      });
      if (!category) {
         throw new NotFoundException('Category not found');
      }
      return category;
   }

   public async update(slug: string, updateCategoryDto: CreateCategoryDto) {
      const category = await this.db.query.categories.findFirst({
         where: eq(categories.slug, slug),
      });
      if (!category) {
         throw new NotFoundException('Category not found');
      }

      const NewSlug = await this.slugGeneratorService.generateUniqueSlug(
         updateCategoryDto.name,
         'categories',
         'slug',
      );

      const returning = await this.db
         .update(categories)
         .set({ ...updateCategoryDto, slug: NewSlug })
         .where(eq(categories.id, category.id))
         .returning();

      return returning[0];
   }

   public async remove(id: number) {
      const category = await this.db.query.categories.findFirst({
         where: eq(categories.id, id),
      });
      if (!category) {
         throw new NotFoundException('Category not found');
      }

      const productsCollection = await this.db.query.products.findMany({
         where: eq(products.category_id, id),
      });
      if (productsCollection.length > 0) {
         throw new BadRequestException(
            'Cannot delete category with associated products',
         );
      }

      await this.db.delete(categories).where(eq(categories.id, category.id));
      return { success: true };
   }
}
