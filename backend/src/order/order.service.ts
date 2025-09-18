import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import { CreateOrderDto } from './dtos/create-order.dto';
import { orders, product_items, users, products } from 'src/db/schemas';
import { eq, inArray } from 'drizzle-orm';

@Injectable()
export class OrderService {
   constructor(@Inject(DB) private readonly db: Database) {}

   public async create(createOrderDto: CreateOrderDto) {
      const customer = await this.db.query.users.findFirst({
         where: eq(users.id, createOrderDto.customer_id),
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
               customer_id: createOrderDto.customer_id,
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

   public async findById(id: number) {
      const order = await this.db.query.orders.findFirst({
         where: eq(orders.id, id),
      });

      if (!order) {
         throw new BadRequestException('Order not found');
      }

      // Get order items separately
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
}
