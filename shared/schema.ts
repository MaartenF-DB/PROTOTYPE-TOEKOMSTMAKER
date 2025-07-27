import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: text("age").notNull(),
  visitingWith: text("visiting_with").notNull(),
  visitingWithOther: text("visiting_with_other"),
  topicRanking: jsonb("topic_ranking").$type<string[]>().notNull(),
  mostImportantTopic: text("most_important_topic").notNull(),
  feelingBefore: integer("feeling_before").notNull(),
  confidenceBefore: integer("confidence_before").notNull(),
  knowledgeBefore: integer("knowledge_before").notNull(),
  feelingAfter: integer("feeling_after"),
  actionChoice: text("action_choice"),
  confidenceAfter: integer("confidence_after"),
  learnedSomethingNew: integer("learned_something_new"),
  mostInterestingLearned: text("most_interesting_learned"),
  result: text("result"),
  isNewCheckoutUser: boolean("is_new_checkout_user").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
