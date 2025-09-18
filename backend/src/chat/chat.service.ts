import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChatDto, CreateConvDto } from './dto/create-conv.dto';
import type { Database } from 'src/db/types/db';
import { DB } from 'src/db/db.module';
import { conversations, messages } from 'src/db/schemas';
import { eq } from 'drizzle-orm';

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

   public async message(senderId: number, convId: number, chatDto: ChatDto) {
      const conversation = await this.db.query.conversations.findFirst({
         where: eq(conversations.id, convId),
      });
      if (!conversation) {
         throw new NotFoundException(
            `Conversation with id ${convId} not found`,
         );
      }

      const message = await this.db
         .insert(messages)
         .values({
            conversation_id: convId,
            sender_id: senderId,
            message: chatDto.message,
         })
         .returning();

      return message[0];
   }
}
