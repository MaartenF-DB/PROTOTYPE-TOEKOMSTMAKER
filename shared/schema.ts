import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  feelingAfter: integer("feeling_after").notNull(),
  actionChoice: text("action_choice").notNull(),
  confidenceAfter: integer("confidence_after").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
