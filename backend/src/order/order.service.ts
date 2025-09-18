import {
   BadRequestException,
   ForbiddenException,
   Inject,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { CreateOrderDto } from './dtos/create-order.dto';
import {
   orders,
   product_items,
   users,
   products,
   type OrderStatus,
} from 'src/db/schemas';
import { eq, inArray } from 'drizzle-orm';
import type { AuthUserType } from 'src/types/auth';

@Injectable()
export class OrderService {
   constructor(@Inject(DB) private readonly db: Database) {}

   public async create(createOrderDto: CreateOrderDto, customerId: number) {
      const customer = await this.db.query.users.findFirst({
         where: eq(users.id, customerId),
      });
      if (!customer) {
         throw new BadRequestException('Customer not found');
      }

      const productIds = createOrderDto.items.map((item) => item.product_id);

      const productsList = await this.db.query.products.findMany({
         where: inArray(products.id, productIds),
      });
      if (productsList.length !== productIds.length) {
         throw new BadRequestException('One or more products not found');
      }

      const productPriceMap = new Map(
         productsList.map((product) => [
            product.id,
            parseFloat(product.price || '0'),
         ]),
      );

      const vendorIds = [
         ...new Set(productsList.map((product) => product.vendor_id)),
      ];

      const vendorsList = await this.db.query.users.findMany({
         where: inArray(users.id, vendorIds),
      });

      if (vendorsList.length !== vendorIds.length) {
         throw new BadRequestException('One or more vendors not found');
      }

      let totalOrderAmount = 0;
      const itemsWithTotals = createOrderDto.items.map((item) => {
         const productPrice = productPriceMap.get(item.product_id) || 0;
         const itemTotal = productPrice * item.qty;
         totalOrderAmount += itemTotal;

         return {
            product_id: item.product_id,
            qty: item.qty,
            total: Math.round(itemTotal * 100),
         };
      });

      return await this.db.transaction(async (tx) => {
         const [newOrder] = await tx
            .insert(orders)
            .values({
               amount: Math.round(totalOrderAmount * 100),
               customer_id: customerId,
               vendor_ids: vendorIds,
               status: 'pending',
            })
            .returning();

         const orderItems = itemsWithTotals.map((item) => ({
            ...item,
            order_id: newOrder.id,
         }));

         const createdItems = await tx
            .insert(product_items)
            .values(orderItems)
            .returning();

         return {
            ...newOrder,
            items: createdItems,
         };
      });
   }

   public async findAll() {
      return await this.db.query.orders.findMany({
         orderBy: (orders, { desc }) => [desc(orders.created_at)],
      });
   }

   public async findById(id: number, user: AuthUserType) {
      const order = await this.db.query.orders.findFirst({
         where: eq(orders.id, id),
      });
      if (!order) {
         throw new BadRequestException('Order not found');
      }

      if (user.role === 'vendor') {
         const vendorIdSet = new Set(order.vendor_ids);
         if (!vendorIdSet.has(user.id)) {
            throw new ForbiddenException('Access Denied');
         }
      } else if (user.role === 'customer') {
         if (user.id !== order.customer_id) {
            throw new ForbiddenException('Access Denied');
         }
      }

      const items = await this.db.query.product_items.findMany({
         where: eq(product_items.order_id, id),
      });

      return {
         ...order,
         items,
      };
   }

   public async findByCustomer(customerId: number) {
      return await this.db.query.orders.findMany({
         where: eq(orders.customer_id, customerId),
         orderBy: (orders, { desc }) => [desc(orders.created_at)],
      });
   }

   public async updateOrderStatus(id: number, status: OrderStatus) {
      const order = await this.db.query.orders.findFirst({
         where: eq(orders.id, id),
      });
      if (!order) {
         throw new NotFoundException('Order not found');
      }

      const returning = await this.db
         .update(orders)
         .set({ status })
         .where(eq(orders.id, id))
         .returning();

      return returning[0];
   }
}
