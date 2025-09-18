import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/types/auth';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrderController {
   constructor(private readonly orderService: OrderService) {}

   @Post()
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.customer)
   public async create(@Body() createOrderDto: CreateOrderDto) {
      return this.orderService.create(createOrderDto);
   }
}
