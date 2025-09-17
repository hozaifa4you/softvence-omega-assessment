import { pgTable, integer, varchar, index } from 'drizzle-orm/pg-core';

export const addresses = pgTable(
   'addresses',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      street_1: varchar({ length: 255 }).notNull(),
      street_2: varchar({ length: 255 }),
      city: varchar({ length: 100 }).notNull(),
      state: varchar({ length: 100 }).notNull(),
      zip: varchar({ length: 20 }).notNull(),
      country: varchar({ length: 100 }).notNull(),
   },
   (table) => [
      index('addresses_city_idx').on(table.city),
      index('addresses_state_idx').on(table.state),
      index('addresses_country_idx').on(table.country),
      index('addresses_zip_idx').on(table.zip),
      index('addresses_location_idx').on(
         table.city,
         table.state,
         table.country,
      ),
   ],
);
