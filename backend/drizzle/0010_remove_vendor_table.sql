ALTER TABLE "addresses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vendors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "addresses" CASCADE;--> statement-breakpoint
DROP TABLE "vendors" CASCADE;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_author_id_unique";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_vendor_id_vendors_id_fk";
--> statement-breakpoint
DROP INDEX "products_author_id_idx";--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "author_id";