"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIntegrationSchema = exports.CreateScheduleJobSchema = exports.WeeklyInsightsSchema = exports.RecommendationSchema = exports.InsightSchema = exports.ReelsPackSchema = exports.ReelScriptSchema = exports.ReelSceneSchema = exports.PostPackSchema = exports.PostSchema = exports.CalendarSchema = exports.CalendarItemSchema = exports.StrategySchema = exports.StrategyWeekSchema = exports.UpdateProjectSchema = exports.CreateProjectSchema = exports.LoginSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("./constants");
exports.SignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.CreateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    industry: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    offer: zod_1.z.string().optional(),
    prices: zod_1.z.string().optional(),
    targetAudience: zod_1.z.string().optional(),
    language: zod_1.z.enum(constants_1.LANGUAGES).default('ENGLISH'),
    tone: zod_1.z.string().default('professional'),
    brandColors: zod_1.z.array(zod_1.z.string()).default([]),
    competitors: zod_1.z.string().optional(),
});
exports.UpdateProjectSchema = exports.CreateProjectSchema.partial();
exports.StrategyWeekSchema = zod_1.z.object({
    week: zod_1.z.number(),
    focus: zod_1.z.string(),
    goals: zod_1.z.array(zod_1.z.string()),
    tactics: zod_1.z.array(zod_1.z.string()),
    kpis: zod_1.z.array(zod_1.z.string()),
});
exports.StrategySchema = zod_1.z.object({
    overview: zod_1.z.string(),
    targetAudience: zod_1.z.string(),
    keyMessages: zod_1.z.array(zod_1.z.string()),
    weeks: zod_1.z.array(exports.StrategyWeekSchema),
    budget: zod_1.z.string().optional(),
});
exports.CalendarItemSchema = zod_1.z.object({
    date: zod_1.z.string(),
    platform: zod_1.z.string(),
    contentType: zod_1.z.string(),
    topic: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()).optional(),
    notes: zod_1.z.string().optional(),
});
exports.CalendarSchema = zod_1.z.object({
    month: zod_1.z.string(),
    items: zod_1.z.array(exports.CalendarItemSchema),
});
exports.PostSchema = zod_1.z.object({
    platform: zod_1.z.string(),
    caption: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()),
    cta: zod_1.z.string(),
    imagePrompt: zod_1.z.string().optional(),
    bestTimeToPost: zod_1.z.string().optional(),
});
exports.PostPackSchema = zod_1.z.object({
    posts: zod_1.z.array(exports.PostSchema),
    theme: zod_1.z.string().optional(),
});
exports.ReelSceneSchema = zod_1.z.object({
    duration: zod_1.z.string(),
    visual: zod_1.z.string(),
    action: zod_1.z.string(),
});
exports.ReelScriptSchema = zod_1.z.object({
    title: zod_1.z.string(),
    hook: zod_1.z.string(),
    scenes: zod_1.z.array(exports.ReelSceneSchema),
    voiceover: zod_1.z.string(),
    onScreenText: zod_1.z.array(zod_1.z.string()),
    cta: zod_1.z.string(),
    hashtags: zod_1.z.array(zod_1.z.string()),
    music: zod_1.z.string().optional(),
});
exports.ReelsPackSchema = zod_1.z.object({
    scripts: zod_1.z.array(exports.ReelScriptSchema),
});
exports.InsightSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    impact: zod_1.z.enum(['high', 'medium', 'low']),
    metric: zod_1.z.string().optional(),
});
exports.RecommendationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    priority: zod_1.z.enum(['high', 'medium', 'low']),
    category: zod_1.z.string(),
});
exports.WeeklyInsightsSchema = zod_1.z.object({
    period: zod_1.z.string(),
    insights: zod_1.z.array(exports.InsightSchema),
    recommendations: zod_1.z.array(exports.RecommendationSchema),
    summary: zod_1.z.string(),
});
exports.CreateScheduleJobSchema = zod_1.z.object({
    scheduledFor: zod_1.z.string().datetime(),
    platform: zod_1.z.string(),
    contentItemId: zod_1.z.string(),
    socialAccountId: zod_1.z.string().optional(),
});
exports.CreateIntegrationSchema = zod_1.z.object({
    type: zod_1.z.string(),
    credentials: zod_1.z.record(zod_1.z.any()).optional(),
    config: zod_1.z.record(zod_1.z.any()).optional(),
});
//# sourceMappingURL=schemas.js.map