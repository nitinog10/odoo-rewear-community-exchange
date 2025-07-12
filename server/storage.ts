import { users, fashionProfiles, recommendations, type User, type InsertUser, type FashionProfile, type InsertFashionProfile, type Recommendation, type InsertRecommendation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createFashionProfile(profile: InsertFashionProfile): Promise<FashionProfile>;
  createRecommendations(recommendations: InsertRecommendation[]): Promise<Recommendation[]>;
  getRecommendationsByProfileId(profileId: number): Promise<Recommendation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private fashionProfiles: Map<number, FashionProfile>;
  private recommendations: Map<number, Recommendation>;
  private currentUserId: number;
  private currentProfileId: number;
  private currentRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.fashionProfiles = new Map();
    this.recommendations = new Map();
    this.currentUserId = 1;
    this.currentProfileId = 1;
    this.currentRecommendationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFashionProfile(insertProfile: InsertFashionProfile): Promise<FashionProfile> {
    const id = this.currentProfileId++;
    const profile: FashionProfile = { 
      ...insertProfile, 
      id,
      colorPreferences: insertProfile.colorPreferences || null,
      stylePreferences: insertProfile.stylePreferences || null
    };
    this.fashionProfiles.set(id, profile);
    return profile;
  }

  async createRecommendations(insertRecommendations: InsertRecommendation[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    for (const insertRec of insertRecommendations) {
      const id = this.currentRecommendationId++;
      const recommendation: Recommendation = {
        ...insertRec,
        id,
        profileId: insertRec.profileId || null,
        imageUrl: insertRec.imageUrl || null,
        createdAt: new Date().toISOString(),
      };
      this.recommendations.set(id, recommendation);
      recommendations.push(recommendation);
    }

    return recommendations;
  }

  async getRecommendationsByProfileId(profileId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (rec) => rec.profileId === profileId,
    );
  }
}

export const storage = new MemStorage();
