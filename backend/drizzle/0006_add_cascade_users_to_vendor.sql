ALTER TABLE "vendors" DROP CONSTRAINT "vendors_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;