CREATE TABLE "survey_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" text NOT NULL,
	"visiting_with" text NOT NULL,
	"visiting_with_other" text,
	"topic_ranking" jsonb NOT NULL,
	"most_important_topic" text NOT NULL,
	"feeling_before" integer NOT NULL,
	"confidence_before" integer NOT NULL,
	"feeling_after" integer,
	"action_choice" text,
	"confidence_after" integer,
	"result" text,
	"is_new_checkout_user" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
