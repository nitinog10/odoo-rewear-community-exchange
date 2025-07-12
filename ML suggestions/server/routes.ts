import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeOutfitCompatibility, generateStyleRecommendations, analyzeItemForCategorization } from "./openai";
import { insertItemSchema, insertSwapSchema, insertDonationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Items routes
  app.get('/api/items', async (req, res) => {
    try {
      const { category, type, status = 'approved' } = req.query;
      const items = await storage.getAllItems({
        category: category as string,
        type: type as string,
        status: status as string
      });
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.get('/api/items/featured', async (req, res) => {
    try {
      const items = await storage.getFeaturedItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching featured items:", error);
      res.status(500).json({ message: "Failed to fetch featured items" });
    }
  });

  app.get('/api/items/:id', async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  app.post('/api/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = insertItemSchema.parse({
        ...req.body,
        userId
      });
      
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.get('/api/users/:userId/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestedUserId = req.params.userId;
      
      // Users can only see their own items unless they're admin
      if (userId !== requestedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const items = await storage.getUserItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      res.status(500).json({ message: "Failed to fetch user items" });
    }
  });

  // AI Suggestions routes
  app.get('/api/items/:id/suggestions', async (req, res) => {
    try {
      const baseItem = await storage.getItem(req.params.id);
      if (!baseItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      const availableItems = await storage.getAllItems({ status: 'approved' });
      const otherItems = availableItems.filter(item => 
        item.id !== baseItem.id && 
        item.category === baseItem.category &&
        item.status === 'approved'
      );

      if (otherItems.length === 0) {
        return res.json({ suggestions: [], reasoning: "No compatible items found" });
      }

      const analysis = await analyzeOutfitCompatibility(baseItem, otherItems);
      
      // Store AI suggestion in database
      await storage.createAISuggestion({
        userId: baseItem.userId!,
        baseItemId: baseItem.id,
        suggestedItems: analysis.suggestions,
        reasoning: analysis.reasoning
      });

      res.json(analysis);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      res.status(500).json({ message: "Failed to get AI suggestions" });
    }
  });

  app.get('/api/users/:userId/ai-recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestedUserId = req.params.userId;
      
      if (userId !== requestedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const user = await storage.getUser(userId);
      const userItems = await storage.getUserItems(userId);
      
      if (userItems.length === 0) {
        return res.json({ outfits: [], personalizedTips: ["Add some items to your wardrobe to get personalized recommendations!"] });
      }

      const recommendations = await generateStyleRecommendations(user, userItems);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      res.status(500).json({ message: "Failed to get AI recommendations" });
    }
  });

  // Swap routes
  app.post('/api/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const swapData = insertSwapSchema.parse({
        ...req.body,
        requesterId: userId
      });
      
      const swap = await storage.createSwap(swapData);
      res.status(201).json(swap);
    } catch (error) {
      console.error("Error creating swap:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid swap data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create swap" });
    }
  });

  app.get('/api/users/:userId/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestedUserId = req.params.userId;
      
      if (userId !== requestedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const swaps = await storage.getUserSwaps(userId);
      res.json(swaps);
    } catch (error) {
      console.error("Error fetching user swaps:", error);
      res.status(500).json({ message: "Failed to fetch user swaps" });
    }
  });

  app.patch('/api/swaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const swapId = req.params.id;
      const updates = req.body;
      
      // TODO: Add authorization check to ensure user can update this swap
      const swap = await storage.updateSwap(swapId, updates);
      res.json(swap);
    } catch (error) {
      console.error("Error updating swap:", error);
      res.status(500).json({ message: "Failed to update swap" });
    }
  });

  // Donation routes
  app.post('/api/donations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const donationData = insertDonationSchema.parse({
        ...req.body,
        donorId: userId
      });
      
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  app.get('/api/users/:userId/donations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestedUserId = req.params.userId;
      
      if (userId !== requestedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const donations = await storage.getUserDonations(userId);
      res.json(donations);
    } catch (error) {
      console.error("Error fetching user donations:", error);
      res.status(500).json({ message: "Failed to fetch user donations" });
    }
  });

  // AI Item categorization
  app.post('/api/items/analyze', isAuthenticated, async (req, res) => {
    try {
      const { title, description, imageBase64 } = req.body;
      
      if (!title && !description) {
        return res.status(400).json({ message: "Title or description required" });
      }
      
      const analysis = await analyzeItemForCategorization(title, description, imageBase64);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing item:", error);
      res.status(500).json({ message: "Failed to analyze item" });
    }
  });

  // Admin routes
  app.get('/api/admin/items', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching admin items:", error);
      res.status(500).json({ message: "Failed to fetch admin items" });
    }
  });

  app.patch('/api/admin/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const itemId = req.params.id;
      const updates = req.body;
      
      const item = await storage.updateItem(itemId, updates);
      res.json(item);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
