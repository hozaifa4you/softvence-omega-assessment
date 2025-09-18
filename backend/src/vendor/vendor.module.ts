import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { DbModule } from '../db/db.module';
import { SlugGeneratorModule } from '../slug-generator/slug-generator.module';

@Module({
   imports: [DbModule, SlugGeneratorModule],
   controllers: [VendorController],
   providers: [VendorService],
})
export class VendorModule {}
