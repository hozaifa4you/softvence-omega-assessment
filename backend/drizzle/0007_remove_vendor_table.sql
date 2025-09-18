-- Remove vendor-related constraints and columns from products table
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_author_id_unique";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_author_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_vendor_id_vendors_id_fk";--> statement-breakpoint
DROP INDEX IF EXISTS "products_author_id_idx";--> statement-breakpoint

-- Add new constraint to make vendor_id reference users table
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Remove author_id column if it exists
ALTER TABLE "products" DROP COLUMN IF EXISTS "author_id";