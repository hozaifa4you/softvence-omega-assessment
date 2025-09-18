ALTER TABLE "vendors" ALTER COLUMN "slug" SET DATA TYPE varchar(190);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "description" varchar(255);