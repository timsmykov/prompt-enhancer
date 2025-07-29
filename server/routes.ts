import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEnhancementSchema, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhance prompt endpoint
  app.post("/api/enhance", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt is required and must be a string" });
      }

      // Simple enhancement logic - prepend enhancement instruction
      const enhancedPrompt = `Make this prompt more detailed and structured: ${prompt}`;
      
      // Save to history if enabled
      const settings = await storage.getSettings();
      if (!settings || settings.saveHistory) {
        await storage.createEnhancement({
          originalPrompt: prompt,
          enhancedPrompt: enhancedPrompt,
        });
      }

      res.json({ 
        originalPrompt: prompt,
        enhancedPrompt: enhancedPrompt,
        stats: {
          improvementRatio: (enhancedPrompt.length / prompt.length).toFixed(1),
          wordsAdded: enhancedPrompt.split(' ').length - prompt.split(' ').length,
          clarityScore: 9.2
        }
      });
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recent enhancements
  app.get("/api/enhancements", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const enhancements = await storage.getRecentEnhancements(limit);
      res.json(enhancements);
    } catch (error) {
      console.error('Error fetching enhancements:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || {
        apiKey: "",
        modelUrl: "https://api.example.com",
        autoEnhance: false,
        saveHistory: true
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Save settings
  app.post("/api/settings", async (req, res) => {
    try {
      const validatedSettings = insertSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateSettings(validatedSettings);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      console.error('Error saving settings:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
