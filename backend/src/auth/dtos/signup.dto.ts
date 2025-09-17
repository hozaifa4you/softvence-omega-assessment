import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDTO {
   @IsString()
   @Length(3, 32)
   name: string;

   @IsString()
   @IsEmail()
   @Length(5, 99)
   email: string;

   @IsString()
   @Length(8, 32)
   password: string;
}
