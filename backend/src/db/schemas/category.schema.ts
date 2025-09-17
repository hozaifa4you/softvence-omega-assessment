import { varchar, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   name: varchar({ length: 100 }).notNull(),
   slug: varchar({ length: 100 }).unique(),
   created_at: timestamp().notNull().defaultNow(),
   updated_at: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
});
