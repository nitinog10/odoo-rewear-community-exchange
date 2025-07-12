import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const fashionProfiles = pgTable("fashion_profiles", {
  id: serial("id").primaryKey(),
  gender: text("gender").notNull(),
  bodyType: text("body_type").notNull(),
  skinTone: text("skin_tone").notNull(),
  occasion: text("occasion").notNull(),
  season: text("season").notNull(),
  colorPreferences: text("color_preferences"),
  stylePreferences: text("style_preferences"),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => fashionProfiles.id),
  title: text("title").notNull(),
  details: json("details").notNull(),
  tips: text("tips").notNull(),
  tags: json("tags").notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFashionProfileSchema = createInsertSchema(fashionProfiles).omit({
  id: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const fashionPreferencesSchema = z.object({
  gender: z.enum(["woman", "man", "non-binary"]),
  bodyType: z.string(),
  skinTone: z.enum(["fair", "light", "medium", "olive", "tan", "dark", "deep"]),
  occasion: z.enum(["casual", "work", "formal", "party", "date", "vacation", "wedding", "exercise"]),
  season: z.enum(["spring", "summer", "fall", "winter"]),
  colorPreferences: z.string().optional(),
  stylePreferences: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFashionProfile = z.infer<typeof insertFashionProfileSchema>;
export type FashionProfile = typeof fashionProfiles.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type FashionPreferences = z.infer<typeof fashionPreferencesSchema>;
