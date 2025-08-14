CREATE TYPE "public"."gym_status" AS ENUM('pending', 'active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'past_due');--> statement-breakpoint
CREATE TYPE "public"."subscription_type" AS ENUM('gym_monthly', 'base_passport', 'unlimited_roamer');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'owner', 'member');--> statement-breakpoint
CREATE TYPE "public"."visit_status" AS ENUM('booked', 'checked_in', 'completed', 'no_show');--> statement-breakpoint
CREATE TABLE "access_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"gym_id" uuid,
	"email" text NOT NULL,
	"role" "user_role" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "gym_owners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" text NOT NULL,
	"contact_phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gyms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"address" jsonb NOT NULL,
	"coordinates" jsonb NOT NULL,
	"amenities" jsonb NOT NULL,
	"photos" jsonb,
	"opening_hours" jsonb,
	"status" "gym_status" DEFAULT 'pending' NOT NULL,
	"monthly_fee" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"home_gym_id" uuid,
	"preferred_name" text,
	"age" integer,
	"occupation" text,
	"location" text,
	"athlete_type" jsonb,
	"subscription_type" "subscription_type",
	"subscription_status" "subscription_status",
	"profile_photo" text,
	"bio" text,
	"phone" text,
	"social_accounts" jsonb,
	"preferences" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"gym_id" uuid,
	"content" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "subscription_type" NOT NULL,
	"status" "subscription_status" NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" NOT NULL,
	"clerk_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"member_id" uuid NOT NULL,
	"gym_id" uuid NOT NULL,
	"visit_date" timestamp with time zone DEFAULT now() NOT NULL,
	"check_in_time" timestamp with time zone,
	"check_out_time" timestamp with time zone,
	"status" "visit_status" DEFAULT 'booked' NOT NULL,
	"qr_code_used" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_gym_id_gyms_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_owners" ADD CONSTRAINT "gym_owners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gyms" ADD CONSTRAINT "gyms_owner_id_gym_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."gym_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_home_gym_id_gyms_id_fk" FOREIGN KEY ("home_gym_id") REFERENCES "public"."gyms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_gym_id_gyms_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_gym_id_gyms_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("id") ON DELETE no action ON UPDATE no action;