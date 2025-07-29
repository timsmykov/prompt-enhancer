import { type User, type InsertUser, type Enhancement, type InsertEnhancement, type Settings, type InsertSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createEnhancement(enhancement: InsertEnhancement): Promise<Enhancement>;
  getRecentEnhancements(limit?: number): Promise<Enhancement[]>;
  
  getSettings(): Promise<Settings | undefined>;
  createOrUpdateSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private enhancements: Map<string, Enhancement>;
  private settings: Settings | undefined;

  constructor() {
    this.users = new Map();
    this.enhancements = new Map();
    this.settings = undefined;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEnhancement(insertEnhancement: InsertEnhancement): Promise<Enhancement> {
    const id = randomUUID();
    const enhancement: Enhancement = {
      ...insertEnhancement,
      id,
      createdAt: new Date(),
    };
    this.enhancements.set(id, enhancement);
    return enhancement;
  }

  async getRecentEnhancements(limit: number = 10): Promise<Enhancement[]> {
    const enhancements = Array.from(this.enhancements.values());
    return enhancements
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async createOrUpdateSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = this.settings?.id || randomUUID();
    this.settings = { ...insertSettings, id };
    return this.settings;
  }
}

export const storage = new MemStorage();
