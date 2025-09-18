import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DbModule } from 'src/db/db.module';
import { SlugGeneratorModule } from 'src/slug-generator/slug-generator.module';

@Module({
   imports: [DbModule, SlugGeneratorModule],
   controllers: [CategoryController],
   providers: [CategoryService],
})
export class CategoryModule {}
