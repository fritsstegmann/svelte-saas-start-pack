CREATE TABLE IF NOT EXISTS "forgot_passwords" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text,
	"userId" integer NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "forgot_passwords_code_unique" UNIQUE("code")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forgot_passwords" ADD CONSTRAINT "forgot_passwords_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
