import {
   Body,
   Controller,
   Param,
   ParseIntPipe,
   Post,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/auth.guard';
import { ChatService } from './chat.service';
import { ChatDto, CreateConvDto } from './dto/create-conv.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import type { AuthUserType } from '../types/auth';

@Controller('chats')
@UseGuards(JwtGuard)
export class ChatController {
   constructor(private readonly chatService: ChatService) {}

   @Post()
   public async create(
      @Body() createConvDto: CreateConvDto,
      @AuthUser() user: AuthUserType,
   ) {
      return this.chatService.create(user.id, createConvDto);
   }

   @Post(':id/message')
   public async message(
      @Body() chatDto: ChatDto,
      @AuthUser() user: AuthUserType,
      @Param('id', ParseIntPipe) convId: number,
   ) {
      return this.chatService.message(user.id, convId, chatDto);
   }
}
