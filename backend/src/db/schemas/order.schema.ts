import { pgTable, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const order_status = pgEnum('order_status', [
   'pending',
   'completed',
   'canceled',
]);

export const orders = pgTable('orders', {
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
});
