import {
   varchar,
   integer,
   pgTable,
   timestamp,
   index,
} from 'drizzle-orm/pg-core';

export const categories = pgTable(
   'categories',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      name: varchar({ length: 100 }).notNull(),
      slug: varchar({ length: 100 }).unique(),
      created_at: timestamp().notNull().defaultNow(),
      updated_at: timestamp()
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('categories_name_idx').on(table.name),
      index('categories_slug_idx').on(table.slug),
   ],
);
