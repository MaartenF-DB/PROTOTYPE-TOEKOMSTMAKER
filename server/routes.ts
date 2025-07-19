import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveyResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create survey response
  app.post("/api/survey-responses", async (req, res) => {
    try {
      const validatedData = insertSurveyResponseSchema.parse(req.body);
      const response = await storage.createSurveyResponse(validatedData);
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all survey responses
  app.get("/api/survey-responses", async (req, res) => {
    try {
      const responses = await storage.getAllSurveyResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single survey response
  app.get("/api/survey-responses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const response = await storage.getSurveyResponse(id);
      if (!response) {
        res.status(404).json({ error: "Survey response not found" });
        return;
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reset all survey responses with authentication
  app.post("/api/survey-responses/reset", async (req, res) => {
    try {
      const { code } = req.body;
      
      // Check authentication code
      if (code !== "NieuweInstituutLINA") {
        res.status(401).json({ error: "Ongeldige authenticatiecode" });
        return;
      }

      await storage.clearAllSurveyResponses();
      res.json({ success: true, message: "Alle survey responses zijn gereset" });
    } catch (error) {
      console.error('Error resetting survey responses:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
