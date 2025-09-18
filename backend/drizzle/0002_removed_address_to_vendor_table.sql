ALTER TABLE "vendors" DROP CONSTRAINT "vendors_address_id_unique";--> statement-breakpoint
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_address_id_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "address_id";