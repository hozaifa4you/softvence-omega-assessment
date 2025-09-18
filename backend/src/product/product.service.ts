import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';

@Injectable()
export class ProductService {
   constructor(
      @Inject(DB) private readonly dataSource: Database,
      private readonly slugGeneratorService: SlugGeneratorService,
   ) {}

   public async create(vendor_id: number, createProductDto: CreateProductDto) {}
}
