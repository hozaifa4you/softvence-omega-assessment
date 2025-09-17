import {
   integer,
   pgTable,
   varchar,
   index,
   timestamp,
   pgEnum,
} from 'drizzle-orm/pg-core';

export const user_role = pgEnum('role', [
   'super_admin',
   'admin',
   'vendor',
   'customer',
]);
export const user_status = pgEnum('status', ['active', 'inactive', 'banned']);

export const users = pgTable(
   'users',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      name: varchar({ length: 32 }).notNull(),
      email: varchar({ length: 99 }).notNull().unique(),
      password: varchar({ length: 255 }).notNull(),
      role: user_role().notNull().default('customer'),
      status: user_status().notNull().default('active'),
      created_at: timestamp().defaultNow(),
      updated_at: timestamp()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [index('idIndex').on(table.id)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Role = (typeof user_role.enumValues)[number];
export type Status = (typeof user_status.enumValues)[number];
