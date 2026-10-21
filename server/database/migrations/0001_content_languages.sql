CREATE TABLE "content_languages" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"direction" text DEFAULT 'ltr' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body" text
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "article_translations" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "attorney_translations" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "category_translations" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "contact_messages" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "faq_translations" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "glossary_term_translations" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "practice_area_translations" ALTER COLUMN "locale" SET DATA TYPE text USING "locale"::text;--> statement-breakpoint
ALTER TABLE "page_translations" ADD CONSTRAINT "page_translations_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "page_translations_page_locale_uq" ON "page_translations" USING btree ("page_id","locale");--> statement-breakpoint
DROP TYPE "public"."locale";
--> statement-breakpoint
INSERT INTO content_languages (code, name, native_name, direction, enabled, sort) VALUES
('en', 'English', 'English', 'ltr', true, 0),
('tr', 'Turkish', 'Türkçe', 'ltr', true, 1),
('zh', 'Chinese', '中文', 'ltr', true, 2),
('es', 'Spanish', 'Español', 'ltr', true, 3),
('hi', 'Hindi', 'हिन्दी', 'ltr', true, 4),
('ar', 'Arabic', 'العربية', 'rtl', true, 5),
('ru', 'Russian', 'Русский', 'ltr', true, 6),
('ja', 'Japanese', '日本語', 'ltr', true, 7),
('de', 'German', 'Deutsch', 'ltr', true, 8);
--> statement-breakpoint
INSERT INTO pages (slug, sort) VALUES ('home', 0), ('about', 1), ('contact', 2),
('practice-areas', 3), ('attorneys', 4), ('blog', 5), ('faq', 6), ('glossary', 7);
