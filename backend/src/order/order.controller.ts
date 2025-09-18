import {
   Body,
   Controller,
   ForbiddenException,
   Get,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   Query,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/types/auth';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import type { AuthUserType } from 'src/types/auth';
import { type OrderStatus } from 'src/db/schemas';
import { ParseStatusPipe } from './pipes/parse-status.pipe';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrderController {
   constructor(private readonly orderService: OrderService) {}

   @Post()
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.customer)
   public async create(
      @Body() createOrderDto: CreateOrderDto,
      @AuthUser() user: AuthUserType,
   ) {
      return this.orderService.create(createOrderDto, user.id);
   }

   @Get()
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.admin)
   public async findAll() {
      return this.orderService.findAll();
   }

   @Get('customers/:customerId')
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.admin, RoleEnum.customer)
   public async findByCustomer(
      @Param('customerId', ParseIntPipe) customerId: number,
      @AuthUser() user: AuthUserType,
   ) {
      if (user.role === RoleEnum.customer && user.id !== customerId) {
         throw new ForbiddenException(
            'Access denied: You can only view your own orders',
         );
      }
      return this.orderService.findByCustomer(customerId);
   }

   @Get(':id')
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.admin, RoleEnum.customer)
   public async findById(@Param('id', ParseIntPipe) id: number) {
      return this.orderService.findById(id);
   }

   @Patch(':id/status')
   @UseGuards(RolesGuard)
   @Roles(RoleEnum.admin)
   public async updateOrderStatus(
      @Param('id', ParseIntPipe) id: number,
      @Query('status', ParseStatusPipe) status: OrderStatus,
   ) {
      return this.orderService.updateOrderStatus(id, status);
   }
}
