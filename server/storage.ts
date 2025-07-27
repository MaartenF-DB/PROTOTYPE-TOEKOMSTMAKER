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
  clearAllSurveyResponses(): Promise<void>;
}

export class DbStorage implements IStorage {
  async getSurveyResponse(id: number): Promise<SurveyResponse | undefined> {
    try {
      const results = await db.select().from(surveyResponses).where(eq(surveyResponses.id, id));
      return results[0];
    } catch (error) {
      console.error('Error getting survey response:', error);
      throw error;
    }
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    try {
      const results = await db.insert(surveyResponses).values([insertResponse]).returning();
      return results[0];
    } catch (error) {
      console.error('Error creating survey response:', error);
      throw error;
    }
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    try {
      console.log('📊 FETCHING ALL SURVEY RESPONSES FROM DATABASE');
      const results = await db.select().from(surveyResponses);
      console.log('📊 DATABASE RESULTS:', results);
      return results;
    } catch (error) {
      console.error('Error getting all survey responses:', error);
      throw error;
    }
  }

  async clearAllSurveyResponses(): Promise<void> {
    try {
      console.log('🗑️ CLEARING ALL SURVEY RESPONSES FROM DATABASE');
      await db.delete(surveyResponses);
      console.log('✅ ALL SURVEY RESPONSES CLEARED');
    } catch (error) {
      console.error('Error clearing all survey responses:', error);
      throw error;
    }
  }
}

export const storage = new DbStorage();
