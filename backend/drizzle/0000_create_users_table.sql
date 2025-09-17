CREATE TYPE "public"."role" AS ENUM('admin', 'vendor', 'customer');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'banned');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(32) NOT NULL,
	"email" varchar(99) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'customer' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idIndex" ON "users" USING btree ("id");