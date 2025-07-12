import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fashionPreferencesSchema } from "@shared/schema";
import { generateFashionRecommendations } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate fashion recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      // Validate request body
      const validationResult = fashionPreferencesSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid preferences data",
          errors: validationResult.error.errors 
        });
      }

      const preferences = validationResult.data;

      // Generate recommendations using OpenAI
      const aiRecommendations = await generateFashionRecommendations(preferences);

      // Create fashion profile
      const profile = await storage.createFashionProfile(preferences);

      // Store recommendations
      const recommendationsData = aiRecommendations.map(rec => ({
        profileId: profile.id,
        title: rec.title,
        details: rec.details,
        tips: rec.tips,
        tags: rec.tags,
        imageUrl: rec.imageUrl,
      }));

      const savedRecommendations = await storage.createRecommendations(recommendationsData);

      res.json({
        profile,
        recommendations: savedRecommendations,
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate recommendations" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
