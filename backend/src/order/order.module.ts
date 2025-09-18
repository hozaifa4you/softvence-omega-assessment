import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DbModule } from 'src/db/db.module';

@Module({
   imports: [DbModule],
   controllers: [OrderController],
   providers: [OrderService],
})
export class OrderModule {}
