import {
   pgTable,
   integer,
   timestamp,
   pgEnum,
   index,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const order_status = pgEnum('order_status', [
   'pending',
   'completed',
   'canceled',
]);

export const orders = pgTable(
   'orders',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      amount: integer().notNull(),
      status: order_status().notNull().default('pending'),
      customer_id: integer()
         .notNull()
         .references(() => users.id),
      vendor_ids: integer().array().notNull(),
      created_at: timestamp().notNull().defaultNow(),
      updated_at: timestamp()
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('orders_customer_id_idx').on(table.customer_id),
      index('orders_status_idx').on(table.status),
      index('orders_created_at_idx').on(table.created_at),
      index('orders_amount_idx').on(table.amount),
   ],
);
