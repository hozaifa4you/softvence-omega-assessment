import {
   pgTable,
   integer,
   timestamp,
   text,
   boolean,
   index,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const conversations = pgTable(
   'conversations',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      user1_id: integer()
         .references(() => users.id)
         .notNull(),
      user2_id: integer()
         .references(() => users.id)
         .notNull(),
      created_at: timestamp().defaultNow(),
   },
   (table) => [
      index('conversations_user1_id_idx').on(table.user1_id),
      index('conversations_user2_id_idx').on(table.user2_id),
      index('conversations_users_idx').on(table.user1_id, table.user2_id),
   ],
);

export const messages = pgTable(
   'messages',
   {
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
   },
   (table) => [
      index('messages_conversation_id_idx').on(table.conversation_id),
      index('messages_sender_id_idx').on(table.sender_id),
      index('messages_is_read_idx').on(table.is_read),
      index('messages_created_at_idx').on(table.created_at),
      index('messages_conversation_created_idx').on(
         table.conversation_id,
         table.created_at,
      ),
   ],
);
