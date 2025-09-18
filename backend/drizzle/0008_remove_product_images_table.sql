DO $$ BEGIN
 CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive', 'out_of_stock');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'banned');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'addresses') THEN
   ALTER TABLE "addresses" DISABLE ROW LEVEL SECURITY;
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_images') THEN
   ALTER TABLE "product_images" DISABLE ROW LEVEL SECURITY;
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vendors') THEN
   ALTER TABLE "vendors" DISABLE ROW LEVEL SECURITY;
 END IF;
END $$;--> statement-breakpoint
DROP TABLE IF EXISTS "addresses" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "product_images" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "vendors" CASCADE;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_author_id_unique') THEN
   ALTER TABLE "products" DROP CONSTRAINT "products_author_id_unique";
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_author_id_users_id_fk') THEN
   ALTER TABLE "products" DROP CONSTRAINT "products_author_id_users_id_fk";
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_vendor_id_vendors_id_fk') THEN
   ALTER TABLE "products" DROP CONSTRAINT "products_vendor_id_vendors_id_fk";
 END IF;
END $$;--> statement-breakpoint
DROP INDEX IF EXISTS "products_author_id_idx";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE "public"."product_status" USING "status"::text::"public"."product_status";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."user_status" USING "status"::text::"public"."user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_vendor_id_users_id_fk') THEN
   ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_users_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'author_id') THEN
   ALTER TABLE "products" DROP COLUMN "author_id";
 END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
   DROP TYPE "public"."status";
 END IF;
END $$;