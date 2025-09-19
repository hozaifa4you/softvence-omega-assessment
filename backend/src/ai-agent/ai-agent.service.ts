import { Inject, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat.mjs';
import crypto from 'crypto';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { PromptDto } from './dots/prompt.dto';

@Injectable()
export class AiAgentService {
   constructor(
      private readonly groq: Groq,
      @Inject(DB) private readonly db: Database,
   ) {}

   public async startConversation(userId: number, promptDto: PromptDto) {
      const messages: ChatCompletionMessageParam[] = [
         {
            role: 'system',
            content: `You are an AI assistant that helps people manage their orders, products and users in the Omega Shop.

            ###
            Current User ID: ${userId}
            ###
            `,
         },
         { role: 'user', content: promptDto.prompt },
      ];

      while (true) {
         const chatCompletion = await this.groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.5,
            tools: [
               {
                  type: 'function',
                  function: {
                     name: 'findAllOrdersForTheUser',
                     description:
                        'Find all orders for a specific user by their user ID.',
                     parameters: {
                        type: 'object',
                        properties: {
                           userId: {
                              type: 'number',
                              description: 'The ID of the user.',
                           },
                        },
                        required: ['userId'],
                     },
                  },
               },
            ],
         });

         const choose = chatCompletion.choices[0];
         messages.push(choose.message);

         if (!choose.message.tool_calls) {
            const id = crypto.randomUUID();
            const messageObj = { id, ...choose.message };
            return messageObj;
         }

         const toolToCall = choose.message.tool_calls;

         const result: string[] = [];
         for (const tool of toolToCall) {
            const functionName = tool.function.name;
            const args = tool.function.arguments;

            if (functionName === 'findAllTodosCountForAUser') {
               const res = await this.aiAgentRepo.findAllTodosCountForAUser(
                  JSON.parse(args),
               );
               result.push(`Total todos: ${res}`);
            }

            messages.push({
               role: 'tool',
               tool_call_id: tool.id,
               content: result.join('\n'),
            });
         }
      }
   }
}
