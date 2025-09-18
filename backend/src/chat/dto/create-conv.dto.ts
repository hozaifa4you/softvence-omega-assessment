import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateConvDto {
   @IsInt()
   user2_id: number;
}

export class ChatDto {
   @IsString()
   @IsNotEmpty()
   @Length(1, 400)
   message: string;
}
