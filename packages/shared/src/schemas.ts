import { z } from 'zod';
import { LANGUAGES } from './constants';

// Auth schemas
export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Project schemas
export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  offer: z.string().optional(),
  prices: z.string().optional(),
  targetAudience: z.string().optional(),
  language: z.enum(LANGUAGES).default('ENGLISH'),
  tone: z.string().default('professional'),
  brandColors: z.array(z.string()).default([]),
  competitors: z.string().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// AI Generation schemas
export const StrategyWeekSchema = z.object({
  week: z.number(),
  focus: z.string(),
  goals: z.array(z.string()),
  tactics: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const StrategySchema = z.object({
  overview: z.string(),
  targetAudience: z.string(),
  keyMessages: z.array(z.string()),
  weeks: z.array(StrategyWeekSchema),
  budget: z.string().optional(),
});

export const CalendarItemSchema = z.object({
  date: z.string(),
  platform: z.string(),
  contentType: z.string(),
  topic: z.string(),
  hashtags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const CalendarSchema = z.object({
  month: z.string(),
  items: z.array(CalendarItemSchema),
});

export const PostSchema = z.object({
  platform: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()),
  cta: z.string(),
  imagePrompt: z.string().optional(),
  bestTimeToPost: z.string().optional(),
});

export const PostPackSchema = z.object({
  posts: z.array(PostSchema),
  theme: z.string().optional(),
});

export const ReelSceneSchema = z.object({
  duration: z.string(),
  visual: z.string(),
  action: z.string(),
});

export const ReelScriptSchema = z.object({
  title: z.string(),
  hook: z.string(),
  scenes: z.array(ReelSceneSchema),
  voiceover: z.string(),
  onScreenText: z.array(z.string()),
  cta: z.string(),
  hashtags: z.array(z.string()),
  music: z.string().optional(),
});

export const ReelsPackSchema = z.object({
  scripts: z.array(ReelScriptSchema),
});

export const InsightSchema = z.object({
  title: z.string(),
  description: z.string(),
  impact: z.enum(['high', 'medium', 'low']),
  metric: z.string().optional(),
});

export const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string(),
});

export const WeeklyInsightsSchema = z.object({
  period: z.string(),
  insights: z.array(InsightSchema),
  recommendations: z.array(RecommendationSchema),
  summary: z.string(),
});

// Schedule schemas
export const CreateScheduleJobSchema = z.object({
  scheduledFor: z.string().datetime(),
  platform: z.string(),
  contentItemId: z.string(),
});

// Integration schemas
export const CreateIntegrationSchema = z.object({
  type: z.string(),
  credentials: z.record(z.any()).optional(),
  config: z.record(z.any()).optional(),
});
