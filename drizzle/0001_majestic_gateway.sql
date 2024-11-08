ALTER TABLE "sessions" ADD COLUMN "twoFaVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "totpSecret" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "twoFaEnabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_totpSecret_unique" UNIQUE("totpSecret");