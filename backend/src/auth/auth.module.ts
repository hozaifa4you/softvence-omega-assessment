import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from '@/db/db.module';

@Module({
   imports: [DbModule],
   providers: [AuthService],
   controllers: [AuthController],
})
export class AuthModule {}
