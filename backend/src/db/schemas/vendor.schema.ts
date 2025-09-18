import {
   pgTable,
   integer,
   varchar,
   pgEnum,
   timestamp,
   index,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

const vendor_status = pgEnum('vendor_status', [
   'active',
   'closed',
   'suspended',
]);

export const vendors = pgTable(
   'vendors',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      name: varchar({ length: 64 }).notNull(),
      slug: varchar({ length: 190 }).notNull().unique(),
      status: vendor_status().notNull().default('active'),
      description: varchar({ length: 255 }),
      author_id: integer()
         .notNull()
         .unique()
         .references(() => users.id, { onDelete: 'cascade' }),
      created_at: timestamp().notNull().defaultNow(),
      updated_at: timestamp()
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('vendors_slug_idx').on(table.slug),
      index('vendors_status_idx').on(table.status),
      index('vendors_author_id_idx').on(table.author_id),
      index('vendors_name_idx').on(table.name),
   ],
);

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type VendorStatus = (typeof vendor_status.enumValues)[number];
