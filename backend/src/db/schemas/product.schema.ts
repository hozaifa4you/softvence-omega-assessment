import {
   integer,
   pgTable,
   varchar,
   text,
   decimal,
   timestamp,
   pgEnum,
   index,
} from 'drizzle-orm/pg-core';
import { categories } from './category.schema';
import { users } from './user.schema';

export const product_status = pgEnum('status', [
   'active',
   'inactive',
   'out_of_stock',
]);

export const products = pgTable(
   'products',
   {
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
      vendor_id: integer()
         .notNull()
         .references(() => users.id, { onDelete: 'cascade' }),
      category_id: integer()
         .notNull()
         .references(() => categories.id),
      created_at: timestamp().notNull().defaultNow(),
      updated_at: timestamp()
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('products_slug_idx').on(table.slug),
      index('products_status_idx').on(table.status),
      index('products_vendor_id_idx').on(table.vendor_id),
      index('products_category_id_idx').on(table.category_id),
      index('products_created_at_idx').on(table.created_at),
      index('products_price_idx').on(table.price),
      index('products_stock_idx').on(table.stock),
      index('products_name_idx').on(table.name),
   ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductStatus = (typeof product_status.enumValues)[number];
