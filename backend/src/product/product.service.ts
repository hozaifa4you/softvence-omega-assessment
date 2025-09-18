import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';

@Injectable()
export class ProductService {
   constructor(@Inject(DB) private readonly dataSource: Database) {}

   public async create(vendor_id: number, createProductDto: CreateProductDto) {}
}
