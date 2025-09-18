export * from './user.schema';
export * from './product.schema';
export * from './category.schema';
export * from './order.schema';
export * from './product_item.schema';
export * from './message.schema';
// export const vendorsRelations = relations(vendors, ({ one }) => ({
//    user: one(users, {
//       fields: [vendors.author_id],
//       references: [users.id],
//    }),
// }));

// export const usersRelations = relations(users, ({ one }) => ({
//    vendor: one(vendors),
// }));
