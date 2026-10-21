CREATE TYPE "public"."content_status" AS ENUM('draft', 'review', 'published');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'tr');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"impersonated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"locale" "locale" NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body" text
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"category_id" integer,
	"attorney_id" integer,
	"cover_image" text,
	"reading_minutes" integer,
	"published_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "attorney_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"attorney_id" integer NOT NULL,
	"locale" "locale" NOT NULL,
	"role" text,
	"area" text,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "attorneys" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"photo" text,
	"email" text,
	"phone" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attorneys_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "category_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"locale" "locale" NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"locale" "locale",
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"faq_id" integer NOT NULL,
	"locale" "locale" NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glossary_term_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"term_id" integer NOT NULL,
	"locale" "locale" NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glossary_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "glossary_terms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "practice_area_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_id" integer NOT NULL,
	"locale" "locale" NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body" text,
	"topics" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"icon" text DEFAULT 'scale' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "practice_areas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_attorney_id_attorneys_id_fk" FOREIGN KEY ("attorney_id") REFERENCES "public"."attorneys"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attorney_translations" ADD CONSTRAINT "attorney_translations_attorney_id_attorneys_id_fk" FOREIGN KEY ("attorney_id") REFERENCES "public"."attorneys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faq_translations" ADD CONSTRAINT "faq_translations_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_term_translations" ADD CONSTRAINT "glossary_term_translations_term_id_glossary_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_area_translations" ADD CONSTRAINT "practice_area_translations_area_id_practice_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "article_translations_article_locale_uq" ON "article_translations" USING btree ("article_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "attorney_translations_attorney_locale_uq" ON "attorney_translations" USING btree ("attorney_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "category_translations_category_locale_uq" ON "category_translations" USING btree ("category_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "faq_translations_faq_locale_uq" ON "faq_translations" USING btree ("faq_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "glossary_term_translations_term_locale_uq" ON "glossary_term_translations" USING btree ("term_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "practice_area_translations_area_locale_uq" ON "practice_area_translations" USING btree ("area_id","locale");