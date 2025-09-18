import { Inject, Injectable } from '@nestjs/common';
import { CreateConvDto } from './dto/create-conv.dto';
import type { Database } from 'src/db/types/db';
import { DB } from 'src/db/db.module';
import { conversations } from 'src/db/schemas';

@Injectable()
export class ChatService {
   constructor(@Inject(DB) private readonly db: Database) {}

   public async create(userId: number, createConvDto: CreateConvDto) {
      const returning = await this.db
         .insert(conversations)
         .values({ ...createConvDto, user1_id: userId })
         .returning();

      return returning[0];
   }
}
