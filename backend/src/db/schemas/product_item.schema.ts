import { pgTable, integer } from 'drizzle-orm/pg-core';
import { products } from './product.schema';
import { orders } from './order.schema';

export const product_items = pgTable('product_items', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   qty: integer().notNull().default(1),
   total: integer().notNull(),
   product_id: integer()
      .notNull()
      .references(() => products.id),
   order_id: integer()
      .notNull()
      .references(() => orders.id),
});
