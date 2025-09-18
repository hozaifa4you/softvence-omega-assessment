import { relations } from 'drizzle-orm';
import { vendors } from './vendor.schema';
import { users } from './user.schema';

export * from './user.schema';
export * from './product.schema';
export * from './category.schema';
export * from './product_image.schema';
export * from './vendor.schema';
export * from './address.schema';
export * from './order.schema';
export * from './product_item.schema';
export * from './message.schema';
export * from './message.schema';

export const vendorsRelations = relations(vendors, ({ one }) => ({
   user: one(users, {
      fields: [vendors.author_id],
      references: [users.id],
   }),
}));

export const usersRelations = relations(users, ({ one }) => ({
   vendor: one(vendors),
}));
