import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  points: integer("points").default(0),
  stylePreferences: jsonb("style_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // Men/Women/Kids
  type: varchar("type").notNull(), // Shirt, Pants, Dress, etc.
  size: varchar("size").notNull(),
  condition: varchar("condition").notNull(), // New, Like New, Good, Fair
  color: varchar("color"),
  brand: varchar("brand"),
  tags: jsonb("tags"), // Array of strings
  images: jsonb("images"), // Array of image URLs
  pointsValue: integer("points_value").default(0),
  userId: varchar("user_id").references(() => users.id),
  status: varchar("status").default("pending"), // pending, approved, rejected, swapped, donated
  isFeatured: boolean("is_featured").default(false),
  isDonation: boolean("is_donation").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const swaps = pgTable("swaps", {
  id: varchar("id").primaryKey().notNull(),
  requesterId: varchar("requester_id").references(() => users.id),
  ownerId: varchar("owner_id").references(() => users.id),
  requesterItemId: varchar("requester_item_id").references(() => items.id),
  ownerItemId: varchar("owner_item_id").references(() => items.id),
  pointsDifference: integer("points_difference").default(0),
  status: varchar("status").default("pending"), // pending, accepted, rejected, completed
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().notNull(),
  donorId: varchar("donor_id").references(() => users.id),
  itemId: varchar("item_id").references(() => items.id),
  pointsEarned: integer("points_earned").default(20),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiSuggestions = pgTable("ai_suggestions", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id),
  baseItemId: varchar("base_item_id").references(() => items.id),
  suggestedItems: jsonb("suggested_items"), // Array of item IDs with match scores
  reasoning: text("reasoning"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSwapSchema = createInsertSchema(swaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;

export type InsertSwap = z.infer<typeof insertSwapSchema>;
export type Swap = typeof swaps.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type AISuggestion = typeof aiSuggestions.$inferSelect;
