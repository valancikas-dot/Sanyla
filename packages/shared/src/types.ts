import { z } from 'zod';
import * as schemas from './schemas';

// Infer types from schemas
export type SignUpInput = z.infer<typeof schemas.SignUpSchema>;
export type LoginInput = z.infer<typeof schemas.LoginSchema>;
export type CreateProjectInput = z.infer<typeof schemas.CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof schemas.UpdateProjectSchema>;
export type Strategy = z.infer<typeof schemas.StrategySchema>;
export type Calendar = z.infer<typeof schemas.CalendarSchema>;
export type PostPack = z.infer<typeof schemas.PostPackSchema>;
export type Post = z.infer<typeof schemas.PostSchema>;
export type ReelsPack = z.infer<typeof schemas.ReelsPackSchema>;
export type ReelScript = z.infer<typeof schemas.ReelScriptSchema>;
export type WeeklyInsights = z.infer<typeof schemas.WeeklyInsightsSchema>;
export type Insight = z.infer<typeof schemas.InsightSchema>;
export type Recommendation = z.infer<typeof schemas.RecommendationSchema>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  city?: string;
  website?: string;
  offer?: string;
  prices?: string;
  targetAudience?: string;
  language: string;
  tone: string;
  brandColors: string[];
  competitors?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentItem {
  id: string;
  type: string;
  title?: string;
  content: any;
  metadata?: any;
  projectId: string;
  batchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleJob {
  id: string;
  scheduledFor: Date;
  platform: string;
  status: string;
  payload?: any;
  error?: string;
  contentItemId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
