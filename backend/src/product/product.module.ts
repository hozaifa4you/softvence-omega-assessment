import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DbModule } from 'src/db/db.module';
import { SlugGeneratorModule } from 'src/slug-generator/slug-generator.module';

@Module({
   imports: [DbModule, SlugGeneratorModule],
   controllers: [ProductController],
   providers: [ProductService],
})
export class ProductModule {}
