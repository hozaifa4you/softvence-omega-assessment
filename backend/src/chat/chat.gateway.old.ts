import {
   WebSocketGateway,
   WebSocketServer,
   SubscribeMessage,
   MessageBody,
   ConnectedSocket,
   OnGatewayConnection,
   OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/auth.guard';
import { ChatService } from './chat.service';
import { CreateConvDto, ChatDto } from './dto/create-conv.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { AuthUserType } from '../types/auth';
@WebSocketGateway({
   cors: {
      origin: '*',
   },
   namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer()
   server: Server;

   constructor(private readonly chatService: ChatService) {}

   handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
   }

   handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
   }

   @UseGuards(JwtGuard)
   @SubscribeMessage('createConversation')
   async handleCreateConversation(
      @MessageBody() createConvDto: CreateConvDto,
      @ConnectedSocket() client: Socket,
      @AuthUser() user: AuthUserType,
   ) {
      try {
         const conversation = await this.chatService.create(
            user.id,
            createConvDto,
         );

         const roomName = `conversation_${conversation.id}`;
         client.join(roomName);

         this.server.to(roomName).emit('conversationCreated', {
            conversation,
            participants: [user.id, createConvDto.user2_id],
         });

         return { success: true, conversation };
      } catch (error) {
         client.emit('error', { message: error.message });
         return { success: false, error: error.message };
      }
   }

   @UseGuards(JwtGuard)
   @SubscribeMessage('sendMessage')
   async handleSendMessage(
      @MessageBody() data: { convId: number; message: ChatDto },
      @ConnectedSocket() client: Socket,
      @AuthUser() user: AuthUserType,
   ) {
      try {
         const message = await this.chatService.message(
            user.id,
            data.convId,
            data.message,
         );

         const roomName = `conversation_${data.convId}`;
         this.server.to(roomName).emit('newMessage', {
            message,
            sender: user,
         });

         return { success: true, message };
      } catch (error) {
         client.emit('error', { message: error.message });
         return { success: false, error: error.message };
      }
   }

   @SubscribeMessage('joinConversation')
   handleJoinConversation(
      @MessageBody() data: { convId: number },
      @ConnectedSocket() client: Socket,
   ) {
      const roomName = `conversation_${data.convId}`;
      client.join(roomName);
      client.emit('joinedConversation', {
         convId: data.convId,
         room: roomName,
      });
   }

   @SubscribeMessage('leaveConversation')
   handleLeaveConversation(
      @MessageBody() data: { convId: number },
      @ConnectedSocket() client: Socket,
   ) {
      const roomName = `conversation_${data.convId}`;
      client.leave(roomName);
      client.emit('leftConversation', { convId: data.convId });
   }

   emitConversationCreated(conversation: any, participants: number[]) {
      const roomName = `conversation_${conversation.id}`;
      this.server.to(roomName).emit('conversationCreated', {
         conversation,
         participants,
      });
   }

   emitNewMessage(convId: number, message: any, sender: any) {
      const roomName = `conversation_${convId}`;
      this.server.to(roomName).emit('newMessage', {
         message,
         sender,
      });
   }
}
