import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import jwtConfig from '../config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';

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
