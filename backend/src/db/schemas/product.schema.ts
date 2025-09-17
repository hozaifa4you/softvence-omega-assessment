import {
   integer,
   pgTable,
   varchar,
   text,
   decimal,
   timestamp,
   pgEnum,
} from 'drizzle-orm/pg-core';
import { categories } from './category.schema';
import { vendors } from './vendor.schema';
import { users } from './user.schema';

export const product_status = pgEnum('status', [
   'active',
   'inactive',
   'out_of_stock',
]);

export const products = pgTable('products', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   name: varchar({ length: 255 }).notNull(),
   slug: varchar({ length: 255 }).notNull().unique(),
   description: text().notNull(),
   price: decimal({ precision: 10, scale: 2 }).notNull(),
   offerPrice: decimal({ precision: 10, scale: 2 }),
   discount: decimal({ precision: 5, scale: 2 }),
   sku: varchar({ length: 100 }).notNull().unique(),
   stock: integer().notNull().default(0),
   status: product_status().notNull().default('active'),
   author_id: integer()
      .notNull()
      .unique()
      .references(() => users.id),
   vendor_id: integer()
      .notNull()
      .references(() => vendors.id),
   category_id: integer()
      .notNull()
      .references(() => categories.id),
   created_at: timestamp().notNull().defaultNow(),
   updated_at: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
});
