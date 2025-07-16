import { surveyResponses, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getSurveyResponse(id: number): Promise<SurveyResponse | undefined>;
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
}

export class MemStorage implements IStorage {
  private responses: Map<number, SurveyResponse>;
  currentId: number;

  constructor() {
    this.responses = new Map();
    this.currentId = 1;
  }

  async getSurveyResponse(id: number): Promise<SurveyResponse | undefined> {
    return this.responses.get(id);
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = this.currentId++;
    const response: SurveyResponse = { 
      ...insertResponse, 
      visitingWithOther: insertResponse.visitingWithOther || null,
      topicRanking: insertResponse.topicRanking as string[],
      isNewCheckoutUser: insertResponse.isNewCheckoutUser || false,
      id, 
      createdAt: new Date()
    };
    this.responses.set(id, response);
    return response;
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return Array.from(this.responses.values());
  }
}

export const storage = new MemStorage();
