import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import type { Database } from '../db/types/db';
import { DB } from '../db/db.module';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { vendors } from 'src/db/schemas';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';

@Injectable()
export class VendorService {
   constructor(
      @Inject(DB) private readonly db: Database,
      private readonly slugGenerator: SlugGeneratorService,
   ) {}

   public async create(userId: number, createVendorDto: CreateVendorDto) {
      if (createVendorDto.status === 'suspended') {
         throw new ForbiddenException(
            'Cannot create vendor with suspended status',
         );
      }

      const slug = await this.slugGenerator.generateUniqueSlug(
         createVendorDto.name,
         'vendors',
         'slug',
      );

      const returning = await this.db
         .insert(vendors)
         .values({ ...createVendorDto, slug, author_id: userId })
         .returning();

      return returning[0];
   }
}
