import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true, load: [appConfig, jwtConfig] }),
      AuthModule,
      DbModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
