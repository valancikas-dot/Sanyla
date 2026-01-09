import { z } from 'zod';
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    password?: string;
}, {
    name?: string;
    email?: string;
    password?: string;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const CreateProjectSchema: z.ZodObject<{
    name: z.ZodString;
    industry: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    offer: z.ZodOptional<z.ZodString>;
    prices: z.ZodOptional<z.ZodString>;
    targetAudience: z.ZodOptional<z.ZodString>;
    language: z.ZodDefault<z.ZodEnum<["LITHUANIAN", "ENGLISH", "LATVIAN", "ESTONIAN", "RUSSIAN", "POLISH", "GERMAN", "FRENCH", "SPANISH", "ITALIAN", "PORTUGUESE", "DUTCH", "SWEDISH", "NORWEGIAN", "DANISH", "FINNISH", "CZECH"]>>;
    tone: z.ZodDefault<z.ZodString>;
    brandColors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    competitors: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    industry?: string;
    country?: string;
    city?: string;
    website?: string;
    offer?: string;
    prices?: string;
    targetAudience?: string;
    language?: "LITHUANIAN" | "ENGLISH" | "LATVIAN" | "ESTONIAN" | "RUSSIAN" | "POLISH" | "GERMAN" | "FRENCH" | "SPANISH" | "ITALIAN" | "PORTUGUESE" | "DUTCH" | "SWEDISH" | "NORWEGIAN" | "DANISH" | "FINNISH" | "CZECH";
    tone?: string;
    brandColors?: string[];
    competitors?: string;
}, {
    name?: string;
    industry?: string;
    country?: string;
    city?: string;
    website?: string;
    offer?: string;
    prices?: string;
    targetAudience?: string;
    language?: "LITHUANIAN" | "ENGLISH" | "LATVIAN" | "ESTONIAN" | "RUSSIAN" | "POLISH" | "GERMAN" | "FRENCH" | "SPANISH" | "ITALIAN" | "PORTUGUESE" | "DUTCH" | "SWEDISH" | "NORWEGIAN" | "DANISH" | "FINNISH" | "CZECH";
    tone?: string;
    brandColors?: string[];
    competitors?: string;
}>;
export declare const UpdateProjectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    country: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    website: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    offer: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    prices: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    targetAudience: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    language: z.ZodOptional<z.ZodDefault<z.ZodEnum<["LITHUANIAN", "ENGLISH", "LATVIAN", "ESTONIAN", "RUSSIAN", "POLISH", "GERMAN", "FRENCH", "SPANISH", "ITALIAN", "PORTUGUESE", "DUTCH", "SWEDISH", "NORWEGIAN", "DANISH", "FINNISH", "CZECH"]>>>;
    tone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    brandColors: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    competitors: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    industry?: string;
    country?: string;
    city?: string;
    website?: string;
    offer?: string;
    prices?: string;
    targetAudience?: string;
    language?: "LITHUANIAN" | "ENGLISH" | "LATVIAN" | "ESTONIAN" | "RUSSIAN" | "POLISH" | "GERMAN" | "FRENCH" | "SPANISH" | "ITALIAN" | "PORTUGUESE" | "DUTCH" | "SWEDISH" | "NORWEGIAN" | "DANISH" | "FINNISH" | "CZECH";
    tone?: string;
    brandColors?: string[];
    competitors?: string;
}, {
    name?: string;
    industry?: string;
    country?: string;
    city?: string;
    website?: string;
    offer?: string;
    prices?: string;
    targetAudience?: string;
    language?: "LITHUANIAN" | "ENGLISH" | "LATVIAN" | "ESTONIAN" | "RUSSIAN" | "POLISH" | "GERMAN" | "FRENCH" | "SPANISH" | "ITALIAN" | "PORTUGUESE" | "DUTCH" | "SWEDISH" | "NORWEGIAN" | "DANISH" | "FINNISH" | "CZECH";
    tone?: string;
    brandColors?: string[];
    competitors?: string;
}>;
export declare const StrategyWeekSchema: z.ZodObject<{
    week: z.ZodNumber;
    focus: z.ZodString;
    goals: z.ZodArray<z.ZodString, "many">;
    tactics: z.ZodArray<z.ZodString, "many">;
    kpis: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    week?: number;
    focus?: string;
    goals?: string[];
    tactics?: string[];
    kpis?: string[];
}, {
    week?: number;
    focus?: string;
    goals?: string[];
    tactics?: string[];
    kpis?: string[];
}>;
export declare const StrategySchema: z.ZodObject<{
    overview: z.ZodString;
    targetAudience: z.ZodString;
    keyMessages: z.ZodArray<z.ZodString, "many">;
    weeks: z.ZodArray<z.ZodObject<{
        week: z.ZodNumber;
        focus: z.ZodString;
        goals: z.ZodArray<z.ZodString, "many">;
        tactics: z.ZodArray<z.ZodString, "many">;
        kpis: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        week?: number;
        focus?: string;
        goals?: string[];
        tactics?: string[];
        kpis?: string[];
    }, {
        week?: number;
        focus?: string;
        goals?: string[];
        tactics?: string[];
        kpis?: string[];
    }>, "many">;
    budget: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    targetAudience?: string;
    overview?: string;
    keyMessages?: string[];
    weeks?: {
        week?: number;
        focus?: string;
        goals?: string[];
        tactics?: string[];
        kpis?: string[];
    }[];
    budget?: string;
}, {
    targetAudience?: string;
    overview?: string;
    keyMessages?: string[];
    weeks?: {
        week?: number;
        focus?: string;
        goals?: string[];
        tactics?: string[];
        kpis?: string[];
    }[];
    budget?: string;
}>;
export declare const CalendarItemSchema: z.ZodObject<{
    date: z.ZodString;
    platform: z.ZodString;
    contentType: z.ZodString;
    topic: z.ZodString;
    hashtags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string;
    platform?: string;
    contentType?: string;
    topic?: string;
    hashtags?: string[];
    notes?: string;
}, {
    date?: string;
    platform?: string;
    contentType?: string;
    topic?: string;
    hashtags?: string[];
    notes?: string;
}>;
export declare const CalendarSchema: z.ZodObject<{
    month: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        platform: z.ZodString;
        contentType: z.ZodString;
        topic: z.ZodString;
        hashtags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date?: string;
        platform?: string;
        contentType?: string;
        topic?: string;
        hashtags?: string[];
        notes?: string;
    }, {
        date?: string;
        platform?: string;
        contentType?: string;
        topic?: string;
        hashtags?: string[];
        notes?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    month?: string;
    items?: {
        date?: string;
        platform?: string;
        contentType?: string;
        topic?: string;
        hashtags?: string[];
        notes?: string;
    }[];
}, {
    month?: string;
    items?: {
        date?: string;
        platform?: string;
        contentType?: string;
        topic?: string;
        hashtags?: string[];
        notes?: string;
    }[];
}>;
export declare const PostSchema: z.ZodObject<{
    platform: z.ZodString;
    caption: z.ZodString;
    hashtags: z.ZodArray<z.ZodString, "many">;
    cta: z.ZodString;
    imagePrompt: z.ZodOptional<z.ZodString>;
    bestTimeToPost: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    platform?: string;
    hashtags?: string[];
    caption?: string;
    cta?: string;
    imagePrompt?: string;
    bestTimeToPost?: string;
}, {
    platform?: string;
    hashtags?: string[];
    caption?: string;
    cta?: string;
    imagePrompt?: string;
    bestTimeToPost?: string;
}>;
export declare const PostPackSchema: z.ZodObject<{
    posts: z.ZodArray<z.ZodObject<{
        platform: z.ZodString;
        caption: z.ZodString;
        hashtags: z.ZodArray<z.ZodString, "many">;
        cta: z.ZodString;
        imagePrompt: z.ZodOptional<z.ZodString>;
        bestTimeToPost: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        platform?: string;
        hashtags?: string[];
        caption?: string;
        cta?: string;
        imagePrompt?: string;
        bestTimeToPost?: string;
    }, {
        platform?: string;
        hashtags?: string[];
        caption?: string;
        cta?: string;
        imagePrompt?: string;
        bestTimeToPost?: string;
    }>, "many">;
    theme: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    posts?: {
        platform?: string;
        hashtags?: string[];
        caption?: string;
        cta?: string;
        imagePrompt?: string;
        bestTimeToPost?: string;
    }[];
    theme?: string;
}, {
    posts?: {
        platform?: string;
        hashtags?: string[];
        caption?: string;
        cta?: string;
        imagePrompt?: string;
        bestTimeToPost?: string;
    }[];
    theme?: string;
}>;
export declare const ReelSceneSchema: z.ZodObject<{
    duration: z.ZodString;
    visual: z.ZodString;
    action: z.ZodString;
}, "strip", z.ZodTypeAny, {
    action?: string;
    duration?: string;
    visual?: string;
}, {
    action?: string;
    duration?: string;
    visual?: string;
}>;
export declare const ReelScriptSchema: z.ZodObject<{
    title: z.ZodString;
    hook: z.ZodString;
    scenes: z.ZodArray<z.ZodObject<{
        duration: z.ZodString;
        visual: z.ZodString;
        action: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        action?: string;
        duration?: string;
        visual?: string;
    }, {
        action?: string;
        duration?: string;
        visual?: string;
    }>, "many">;
    voiceover: z.ZodString;
    onScreenText: z.ZodArray<z.ZodString, "many">;
    cta: z.ZodString;
    hashtags: z.ZodArray<z.ZodString, "many">;
    music: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    hashtags?: string[];
    cta?: string;
    title?: string;
    hook?: string;
    scenes?: {
        action?: string;
        duration?: string;
        visual?: string;
    }[];
    voiceover?: string;
    onScreenText?: string[];
    music?: string;
}, {
    hashtags?: string[];
    cta?: string;
    title?: string;
    hook?: string;
    scenes?: {
        action?: string;
        duration?: string;
        visual?: string;
    }[];
    voiceover?: string;
    onScreenText?: string[];
    music?: string;
}>;
export declare const ReelsPackSchema: z.ZodObject<{
    scripts: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        hook: z.ZodString;
        scenes: z.ZodArray<z.ZodObject<{
            duration: z.ZodString;
            visual: z.ZodString;
            action: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            action?: string;
            duration?: string;
            visual?: string;
        }, {
            action?: string;
            duration?: string;
            visual?: string;
        }>, "many">;
        voiceover: z.ZodString;
        onScreenText: z.ZodArray<z.ZodString, "many">;
        cta: z.ZodString;
        hashtags: z.ZodArray<z.ZodString, "many">;
        music: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        hashtags?: string[];
        cta?: string;
        title?: string;
        hook?: string;
        scenes?: {
            action?: string;
            duration?: string;
            visual?: string;
        }[];
        voiceover?: string;
        onScreenText?: string[];
        music?: string;
    }, {
        hashtags?: string[];
        cta?: string;
        title?: string;
        hook?: string;
        scenes?: {
            action?: string;
            duration?: string;
            visual?: string;
        }[];
        voiceover?: string;
        onScreenText?: string[];
        music?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    scripts?: {
        hashtags?: string[];
        cta?: string;
        title?: string;
        hook?: string;
        scenes?: {
            action?: string;
            duration?: string;
            visual?: string;
        }[];
        voiceover?: string;
        onScreenText?: string[];
        music?: string;
    }[];
}, {
    scripts?: {
        hashtags?: string[];
        cta?: string;
        title?: string;
        hook?: string;
        scenes?: {
            action?: string;
            duration?: string;
            visual?: string;
        }[];
        voiceover?: string;
        onScreenText?: string[];
        music?: string;
    }[];
}>;
export declare const InsightSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    impact: z.ZodEnum<["high", "medium", "low"]>;
    metric: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    impact?: "high" | "medium" | "low";
    metric?: string;
}, {
    title?: string;
    description?: string;
    impact?: "high" | "medium" | "low";
    metric?: string;
}>;
export declare const RecommendationSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<["high", "medium", "low"]>;
    category: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    priority?: "high" | "medium" | "low";
    category?: string;
}, {
    title?: string;
    description?: string;
    priority?: "high" | "medium" | "low";
    category?: string;
}>;
export declare const WeeklyInsightsSchema: z.ZodObject<{
    period: z.ZodString;
    insights: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        impact: z.ZodEnum<["high", "medium", "low"]>;
        metric: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        description?: string;
        impact?: "high" | "medium" | "low";
        metric?: string;
    }, {
        title?: string;
        description?: string;
        impact?: "high" | "medium" | "low";
        metric?: string;
    }>, "many">;
    recommendations: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodEnum<["high", "medium", "low"]>;
        category: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        description?: string;
        priority?: "high" | "medium" | "low";
        category?: string;
    }, {
        title?: string;
        description?: string;
        priority?: "high" | "medium" | "low";
        category?: string;
    }>, "many">;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    period?: string;
    insights?: {
        title?: string;
        description?: string;
        impact?: "high" | "medium" | "low";
        metric?: string;
    }[];
    recommendations?: {
        title?: string;
        description?: string;
        priority?: "high" | "medium" | "low";
        category?: string;
    }[];
    summary?: string;
}, {
    period?: string;
    insights?: {
        title?: string;
        description?: string;
        impact?: "high" | "medium" | "low";
        metric?: string;
    }[];
    recommendations?: {
        title?: string;
        description?: string;
        priority?: "high" | "medium" | "low";
        category?: string;
    }[];
    summary?: string;
}>;
export declare const CreateScheduleJobSchema: z.ZodObject<{
    scheduledFor: z.ZodString;
    platform: z.ZodString;
    contentItemId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    platform?: string;
    scheduledFor?: string;
    contentItemId?: string;
}, {
    platform?: string;
    scheduledFor?: string;
    contentItemId?: string;
}>;
export declare const CreateIntegrationSchema: z.ZodObject<{
    type: z.ZodString;
    credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type?: string;
    credentials?: Record<string, any>;
    config?: Record<string, any>;
}, {
    type?: string;
    credentials?: Record<string, any>;
    config?: Record<string, any>;
}>;
//# sourceMappingURL=schemas.d.ts.map