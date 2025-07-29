import { surveyResponses, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  getSurveyResponse(id: number): Promise<SurveyResponse | undefined>;
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
  updateSurveyResponse(id: number, data: Partial<InsertSurveyResponse>): Promise<SurveyResponse | undefined>;
  findSurveyResponseByName(name: string): Promise<SurveyResponse | undefined>;
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
      console.log("💾 CREATING SURVEY RESPONSE:", insertResponse);
      
      // Check if this is a checkout completion (has checkout data)
      const isCheckoutCompletion = insertResponse.feelingAfter !== null && insertResponse.feelingAfter !== undefined;
      
      if (isCheckoutCompletion) {
        // Look for existing check-in record with same name (case insensitive)
        const existingCheckIn = await db
          .select()
          .from(surveyResponses)
          .where(eq(surveyResponses.name, insertResponse.name.toLowerCase()))
          .orderBy(desc(surveyResponses.createdAt))
          .limit(1);
        
        if (existingCheckIn.length > 0 && existingCheckIn[0].feelingAfter === null) {
          console.log("🔄 UPDATING EXISTING CHECK-IN WITH CHECKOUT DATA:", existingCheckIn[0].id);
          // Update existing check-in record with checkout data instead of creating new record
          const results = await db
            .update(surveyResponses)
            .set({
              feelingAfter: insertResponse.feelingAfter,
              actionChoice: insertResponse.actionChoice,
              confidenceAfter: insertResponse.confidenceAfter,
              learnedSomethingNew: insertResponse.learnedSomethingNew,
              mostInterestingLearned: insertResponse.mostInterestingLearned,
              result: insertResponse.result,
              isNewCheckoutUser: insertResponse.isNewCheckoutUser || false
            })
            .where(eq(surveyResponses.id, existingCheckIn[0].id))
            .returning();
          console.log("✅ UPDATED COMPLETE SURVEY RESPONSE:", results[0]);
          return results[0];
        }
      }
      
      // If not checkout completion or no existing check-in found, create new record
      const results = await db.insert(surveyResponses).values([insertResponse]).returning();
      console.log("✅ CREATED NEW SURVEY RESPONSE:", results[0]);
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

  async updateSurveyResponse(id: number, data: Partial<InsertSurveyResponse>): Promise<SurveyResponse | undefined> {
    try {
      console.log('🔄 UPDATING SURVEY RESPONSE:', { id, data });
      const updateData: any = { ...data };
      const results = await db.update(surveyResponses)
        .set(updateData)
        .where(eq(surveyResponses.id, id))
        .returning();
      console.log('✅ UPDATED SURVEY RESPONSE:', results[0]);
      return results[0];
    } catch (error) {
      console.error('Error updating survey response:', error);
      throw error;
    }
  }

  async findSurveyResponseByName(name: string): Promise<SurveyResponse | undefined> {
    try {
      console.log('🔍 FINDING SURVEY RESPONSE BY NAME:', name);
      const results = await db.select().from(surveyResponses).where(eq(surveyResponses.name, name.toLowerCase()));
      console.log('📍 FOUND RESPONSE:', results[0]);
      return results[0];
    } catch (error) {
      console.error('Error finding survey response by name:', error);
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
