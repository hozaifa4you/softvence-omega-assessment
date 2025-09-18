import {
   WebSocketGateway,
   WebSocketServer,
   SubscribeMessage,
   MessageBody,
   ConnectedSocket,
   OnGatewayConnection,
   OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateConvDto, ChatDto } from './dto/create-conv.dto';

interface CreateConversationPayload {
   createConvDto: CreateConvDto;
   userId: number;
}

interface SendMessagePayload {
   convId: number;
   message: ChatDto;
   userId: number;
}

interface JoinLeavePayload {
   convId: number;
}

@WebSocketGateway({
   cors: {
      origin: '*',
   },
   namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer()
   server: any;

   constructor(private readonly chatService: ChatService) {}

   handleConnection(client: any): void {
      console.info(`Client connected: ${client.id as string}`);
   }

   handleDisconnect(client: any): void {
      console.info(`Client disconnected: ${client.id as string}`);
   }

   @SubscribeMessage('createConversation')
   async handleCreateConversation(
      @MessageBody() data: CreateConversationPayload,
      @ConnectedSocket() client: any,
   ) {
      try {
         const conversation = await this.chatService.create(
            data.userId,
            data.createConvDto,
         );

         const roomName = `conversation_${conversation.id}`;
         await client.join(roomName);

         this.server.to(roomName).emit('conversationCreated', {
            conversation,
            participants: [data.userId, data.createConvDto.user2_id],
         });

         return { success: true, conversation };
      } catch (error: unknown) {
         const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
         client.emit('error', { message: errorMessage });
         return { success: false, error: errorMessage };
      }
   }

   @SubscribeMessage('sendMessage')
   async handleSendMessage(
      @MessageBody() data: SendMessagePayload,
      @ConnectedSocket() client: any,
   ) {
      try {
         const message = await this.chatService.message(
            data.userId,
            data.convId,
            data.message,
         );

         const roomName = `conversation_${data.convId}`;
         this.server.to(roomName).emit('newMessage', {
            message,
            senderId: data.userId,
         });

         return { success: true, message };
      } catch (error: unknown) {
         const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
         client.emit('error', { message: errorMessage });
         return { success: false, error: errorMessage };
      }
   }

   @SubscribeMessage('joinConversation')
   async handleJoinConversation(
      @MessageBody() data: JoinLeavePayload,
      @ConnectedSocket() client: any,
   ): Promise<void> {
      const roomName = `conversation_${data.convId}`;
      await client.join(roomName);
      client.emit('joinedConversation', {
         convId: data.convId,
         room: roomName,
      });
   }

   @SubscribeMessage('leaveConversation')
   async handleLeaveConversation(
      @MessageBody() data: JoinLeavePayload,
      @ConnectedSocket() client: any,
   ): Promise<void> {
      const roomName = `conversation_${data.convId}`;
      await client.leave(roomName);
      client.emit('leftConversation', { convId: data.convId });
   }

   emitConversationCreated(
      conversation: unknown,
      participants: number[],
   ): void {
      const conv = conversation as { id: number };
      const roomName = `conversation_${conv.id}`;
      this.server.to(roomName).emit('conversationCreated', {
         conversation,
         participants,
      });
   }

   emitNewMessage(convId: number, message: unknown, senderId: number): void {
      const roomName = `conversation_${convId}`;
      this.server.to(roomName).emit('newMessage', {
         message,
         senderId,
      });
   }
}
