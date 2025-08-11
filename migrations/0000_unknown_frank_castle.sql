CREATE TYPE "public"."status" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "trips" (
	"tripDetail" text NOT NULL,
	"imageUrls" text[] DEFAULT ARRAY[]::text[],
	"created_at" date NOT NULL,
	"payment_link" text,
	"userId" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"accountId" varchar(1000) NOT NULL,
	"imageUrl" varchar(1000),
	"joinedAt" date NOT NULL,
	"status" "status" DEFAULT 'user',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
