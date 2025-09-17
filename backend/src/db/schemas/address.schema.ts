import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const addresses = pgTable('addresses', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   street_1: varchar({ length: 255 }).notNull(),
   street_2: varchar({ length: 255 }),
   city: varchar({ length: 100 }).notNull(),
   state: varchar({ length: 100 }).notNull(),
   zip: varchar({ length: 20 }).notNull(),
   country: varchar({ length: 100 }).notNull(),
});
