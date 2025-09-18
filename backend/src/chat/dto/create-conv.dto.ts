import { IsInt } from 'class-validator';

export class CreateConvDto {
   @IsInt()
   user2_id: number;
}
