import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const enhancements = pgTable("enhancements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalPrompt: text("original_prompt").notNull(),
  enhancedPrompt: text("enhanced_prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKey: text("api_key"),
  modelUrl: text("model_url").default("https://api.example.com"),
  autoEnhance: boolean("auto_enhance").default(false),
  saveHistory: boolean("save_history").default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertEnhancementSchema = createInsertSchema(enhancements).omit({
  id: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEnhancement = z.infer<typeof insertEnhancementSchema>;
export type Enhancement = typeof enhancements.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
