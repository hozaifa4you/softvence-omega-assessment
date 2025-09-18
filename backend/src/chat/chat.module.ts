import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';

@Module({
   imports: [DbModule, AuthModule],
   controllers: [ChatController],
   providers: [
      ChatService,
      ChatGateway,
      {
         provide: 'CHAT_GATEWAY_INJECTION',
         useFactory: (chatService: ChatService, chatGateway: ChatGateway) => {
            chatService.setChatGateway(chatGateway);
            return chatGateway;
         },
         inject: [ChatService, ChatGateway],
      },
   ],
   exports: [ChatService, ChatGateway],
})
export class ChatModule {}
