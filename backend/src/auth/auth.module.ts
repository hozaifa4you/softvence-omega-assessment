import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { DbModule } from '@/db/db.module';
import { UserService } from '@/user/user.service';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@/config/jwt.config';

@Module({
   imports: [
      DbModule,
      JwtModule.registerAsync(jwtConfig.asProvider()),
      ConfigModule.forFeature(jwtConfig),
   ],
   providers: [JwtStrategy, LocalStrategy, AuthService, UserService],
   controllers: [AuthController],
})
export class AuthModule {}
