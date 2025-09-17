import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { LocalGuard } from './guards/local.guard';
import { SignupDTO } from './dtos/signup.dto';
import { type AuthUserType } from 'src/types/auth';

@Controller('auth')
export class AuthController {
   constructor(private readonly AuthService: AuthService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post('signup')
   async signup(@Body() body: SignupDTO) {
      return this.AuthService.signup(body);
   }

   @HttpCode(HttpStatus.OK)
   @UseGuards(LocalGuard)
   @Post('signin')
   async signin(@AuthUser() user: AuthUserType) {
      return this.AuthService.signin(user);
   }

   @HttpCode(HttpStatus.OK)
   @Post('forgot-password')
   async forgotPassword() {}

   @HttpCode(HttpStatus.OK)
   @Post('reset-password')
   async resetPassword() {}

   @HttpCode(HttpStatus.OK)
   @Post('signup-with-github')
   async signupWithGithub() {}

   @HttpCode(HttpStatus.OK)
   @Post('signup-with-google')
   async signupWithGoogle() {}
}
