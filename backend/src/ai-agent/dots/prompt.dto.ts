import { IsString, Length } from 'class-validator';

export class PromptDto {
   @IsString()
   @Length(10, 150)
   prompt: string;
}
