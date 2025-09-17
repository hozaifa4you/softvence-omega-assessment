import {
   pgTable,
   integer,
   varchar,
   pgEnum,
   timestamp,
} from 'drizzle-orm/pg-core';
import { addresses } from './address.schema';
import { users } from './user.schema';

const vendor_status = pgEnum('status', ['active', 'closed', 'suspended']);

export const vendors = pgTable('vendors', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   name: varchar({ length: 64 }).notNull(),
   slug: varchar({ length: 90 }).notNull().unique(),
   status: vendor_status().notNull().default('active'),
   author_id: integer()
      .notNull()
      .unique()
      .references(() => users.id),
   address_id: integer()
      .unique()
      .references(() => addresses.id),
   created_at: timestamp().notNull().defaultNow(),
   updated_at: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
});
