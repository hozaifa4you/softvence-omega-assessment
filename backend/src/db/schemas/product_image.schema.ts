import {
   pgTable,
   integer,
   varchar,
   boolean,
   timestamp,
   index,
} from 'drizzle-orm/pg-core';
import { products } from './product.schema';

export const product_images = pgTable(
   'product_images',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      product_id: integer()
         .references(() => products.id)
         .notNull(),
      image_url: varchar({ length: 500 }).notNull(),
      is_primary: boolean().default(false),
      created_at: timestamp().notNull().defaultNow(),
      updated_at: timestamp()
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('product_images_product_id_idx').on(table.product_id),
      index('product_images_is_primary_idx').on(table.is_primary),
      index('product_images_composite_idx').on(
         table.product_id,
         table.is_primary,
      ),
   ],
);
