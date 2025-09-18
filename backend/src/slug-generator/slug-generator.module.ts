import { Module } from '@nestjs/common';
import { SlugGeneratorService } from './slug-generator.service';
import { DbModule } from 'src/db/db.module';

@Module({
   imports: [DbModule],
   providers: [SlugGeneratorService],
   exports: [SlugGeneratorService],
})
export class SlugGeneratorModule {}
