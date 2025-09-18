import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';
import { categories } from 'src/db/schemas';
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

   public async update(id: number, updateCategoryDto: CreateCategoryDto) {
      const category = await this.db.query.categories.findFirst({
         where: eq(categories.id, id),
      });
      if (!category) {
         throw new NotFoundException('Category not found');
      }

      const slug = await this.slugGeneratorService.generateUniqueSlug(
         updateCategoryDto.name,
         'categories',
         'slug',
      );

      const returning = await this.db
         .update(categories)
         .set({ ...updateCategoryDto, slug })
         .where(eq(categories.id, category.id))
         .returning();

      return returning[0];
   }
}
