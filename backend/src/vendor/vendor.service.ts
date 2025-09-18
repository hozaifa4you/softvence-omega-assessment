import {
   Inject,
   Injectable,
   ForbiddenException,
   NotFoundException,
} from '@nestjs/common';
import type { Database } from '../db/types/db';
import { DB } from '../db/db.module';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { vendors } from 'src/db/schemas';
import { SlugGeneratorService } from 'src/slug-generator/slug-generator.service';
import { UpdateVendorDto } from './dtos/update-vendor.dto';
import { eq } from 'drizzle-orm';

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

   public async findOne(id: number) {
      const vendor = await this.db.query.vendors.findFirst({
         where: eq(vendors.id, id),
         with: {
            user: {
               columns: { id: true, name: true, email: true, status: true },
            },
         },
      });

      if (!vendor) {
         throw new NotFoundException('Vendor not found');
      }

      return vendor;
   }

   public async update(id: number, updateVendorDto: UpdateVendorDto) {
      if (updateVendorDto.status === 'suspended') {
         throw new ForbiddenException(
            'Cannot update vendor to suspended status',
         );
      }

      const updated = await this.db
         .update(vendors)
         .set(updateVendorDto)
         .where(eq(vendors.id, id))
         .returning();

      return updated[0];
   }
}
