CREATE TYPE "public"."vendor_status" AS ENUM('active', 'closed', 'suspended');--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "status" SET DATA TYPE "public"."vendor_status" USING status::text::vendor_status;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "status" SET DEFAULT 'active';