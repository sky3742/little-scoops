CREATE TYPE "public"."diaper_change_type" AS ENUM('wet', 'dirty', 'both');--> statement-breakpoint
CREATE TYPE "public"."handoff_item_type" AS ENUM('milk', 'diaper');--> statement-breakpoint
CREATE TABLE "babysitter_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diaper_changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"type" "diaper_change_type" DEFAULT 'wet' NOT NULL,
	"change_date" date DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "diaper_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "handoffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_type" "handoff_item_type" NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milk_feedings" (
	"id" serial PRIMARY KEY NOT NULL,
	"scoops" integer NOT NULL,
	"grams_per_scoop" numeric(5, 2) DEFAULT '4.30' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "milk_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount_kg" numeric(10, 3) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
