import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { PromptDto } from './dots/prompt.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import type { AuthUserType } from 'src/types/auth';

@UseGuards(JwtGuard)
@Controller('ai-agent')
export class AiAgentController {
   constructor(private readonly aiAgentService: AiAgentService) {}

   @Post('start-conversation')
   @HttpCode(HttpStatus.OK)
   public async startConversation(
      @Body() prompt: PromptDto,
      @AuthUser() user: AuthUserType,
   ) {
      return this.aiAgentService.startConversation(user.id, prompt);
   }
}
