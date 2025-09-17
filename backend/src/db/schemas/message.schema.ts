import {
   pgTable,
   integer,
   timestamp,
   text,
   boolean,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const conversations = pgTable('conversations', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   user1_id: integer()
      .references(() => users.id)
      .notNull(),
   user2_id: integer()
      .references(() => users.id)
      .notNull(),
   created_at: timestamp().defaultNow(),
});

export const messages = pgTable('messages', {
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   conversation_id: integer()
      .references(() => conversations.id)
      .notNull(),
   sender_id: integer()
      .references(() => users.id)
      .notNull(),
   message: text(),
   image: text(),
   is_read: boolean().default(false),
   created_at: timestamp().defaultNow(),
});
