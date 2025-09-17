import {
   BadRequestException,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { SignupDTO } from '@/auth/dtos/signup.dto';
import * as argon from 'argon2';
import { JwtPayload } from '@/types/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { AuthUserType, RoleEnum } from '@/types/auth';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
   ) {}

   public async signup(signupDto: SignupDTO) {
      await this.userService.createUser(signupDto, RoleEnum.customer);

      return { success: true };
   }

   public async signin(user: AuthUserType) {
      const tokens = await this.generateTokens(user.id);
      return { user, ...tokens };
   }

   public async forgotPassword() {}
   public async resetPassword() {}
   public async signupWithGithub() {}
   public async signupWithGoogle() {}

   public async validateUser(email: string, password: string) {
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
         throw new BadRequestException('Invalid credentials');
      }

      const isMatch = await argon.verify(user.password, password);
      if (!isMatch) {
         throw new BadRequestException('Invalid credentials');
      }

      return {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         status: user.status,
      };
   }

   public async validateJwtUser(userId: number) {
      const user = await this.userService.findUserById(userId);
      if (!user) throw new NotFoundException('User not found');

      const authUser: AuthUserType = {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         status: user.status,
      };

      return authUser;
   }

   private async generateTokens(userId: number) {
      const payload: JwtPayload = { sub: userId };

      const [access_token] = await Promise.all([
         this.jwtService.signAsync(payload),
      ]);

      return { access_token };
   }
}
