import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { SlugGeneratorModule } from './slug-generator/slug-generator.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { AiAgentModule } from './ai-agent/ai-agent.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true, load: [appConfig, jwtConfig] }),
      AuthModule,
      DbModule,
      UserModule,
      ProductModule,
      SlugGeneratorModule,
      CategoryModule,
      OrderModule,
      ChatModule,
      AiAgentModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
