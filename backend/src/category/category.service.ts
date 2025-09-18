import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';
import { categories } from 'src/db/schemas';

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
}
