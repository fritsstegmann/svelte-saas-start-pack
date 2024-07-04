CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"name" text,
	"username" text,
	"email" text,
	"password" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
