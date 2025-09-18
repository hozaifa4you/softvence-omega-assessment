import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChatDto, CreateConvDto } from './dto/create-conv.dto';
import type { Database } from '../db/types/db';
import { DB } from '../db/db.module';
import { conversations, messages } from '../db/schemas';
import { eq } from 'drizzle-orm';

interface ChatGateway {
   emitConversationCreated(conversation: unknown, participants: number[]): void;
   emitNewMessage(convId: number, message: unknown, senderId: number): void;
}

@Injectable()
export class ChatService {
   private chatGateway: ChatGateway | null = null;

   constructor(@Inject(DB) private readonly db: Database) {}

   setChatGateway(gateway: ChatGateway): void {
      this.chatGateway = gateway;
   }

   public async create(userId: number, createConvDto: CreateConvDto) {
      const returning = await this.db
         .insert(conversations)
         .values({ ...createConvDto, user1_id: userId })
         .returning();

      const conversation = returning[0];

      if (this.chatGateway) {
         this.chatGateway.emitConversationCreated(conversation, [
            userId,
            createConvDto.user2_id,
         ]);
      }

      return conversation;
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

      const newMessage = message[0];

      if (this.chatGateway) {
         this.chatGateway.emitNewMessage(convId, newMessage, senderId);
      }

      return newMessage;
   }
}
