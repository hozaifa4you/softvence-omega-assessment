import { pgTable, integer, index } from 'drizzle-orm/pg-core';
import { products } from './product.schema';
import { orders } from './order.schema';

export const product_items = pgTable(
   'product_items',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      qty: integer().notNull().default(1),
      total: integer().notNull(),
      product_id: integer()
         .notNull()
         .references(() => products.id),
      order_id: integer()
         .notNull()
         .references(() => orders.id),
   },
   (table) => [
      index('product_items_product_id_idx').on(table.product_id),
      index('product_items_order_id_idx').on(table.order_id),
      index('product_items_composite_idx').on(table.product_id, table.order_id),
   ],
);

export type ProductItem = typeof product_items.$inferSelect;
export type NewProductItem = typeof product_items.$inferInsert;
