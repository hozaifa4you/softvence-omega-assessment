import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import Groq from 'groq-sdk';
import groqConfig from 'src/config/groq.config';
import { ConfigType } from '@nestjs/config';

@Module({
   controllers: [AiAgentController],
   providers: [
      AiAgentService,
      {
         provide: Groq,
         inject: [groqConfig.KEY],
         useFactory: (config: ConfigType<typeof groqConfig>) =>
            new Groq({ apiKey: config.groqApiKey }),
      },
   ],
})
export class AiAgentModule {}
