import { surveyResponses, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  getSurveyResponse(id: number): Promise<SurveyResponse | undefined>;
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
}

export class DbStorage implements IStorage {
  async getSurveyResponse(id: number): Promise<SurveyResponse | undefined> {
    const results = await db.select().from(surveyResponses).where(eq(surveyResponses.id, id));
    return results[0];
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const results = await db.insert(surveyResponses).values(insertResponse).returning();
    return results[0];
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return await db.select().from(surveyResponses);
  }
}

export const storage = new DbStorage();
