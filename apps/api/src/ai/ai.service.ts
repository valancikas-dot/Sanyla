import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { OpenAiService } from './openai.service';
import { AuditService } from '../common/audit.service';
import {
  StrategySchema,
  CalendarSchema,
  PostPackSchema,
  ReelsPackSchema,
  WeeklyInsightsSchema,
  Strategy,
  Calendar,
  PostPack,
  ReelsPack,
  WeeklyInsights,
} from '@marketing-autopilot/shared';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
    private openai: OpenAiService,
    private auditService: AuditService,
  ) {}

  private async getBrandContext(projectId: string, userId: string) {
    const project = await this.projectsService.getProject(projectId, userId);

    return {
      name: project.name,
      industry: project.industry,
      country: project.country,
      city: project.city,
      website: project.website,
      offer: project.offer,
      prices: project.prices,
      targetAudience: project.targetAudience,
      language: project.language,
      tone: project.tone,
      brandColors: project.brandColors,
      competitors: project.competitors,
    };
  }

  private buildSystemPrompt(brand: any): string {
    const languageMap: Record<string, string> = {
      LITHUANIAN: 'Lithuanian (Lietuvių kalba)',
      ENGLISH: 'English',
      LATVIAN: 'Latvian (Latviešu valoda)',
      ESTONIAN: 'Estonian (Eesti keel)',
      RUSSIAN: 'Russian (Русский язык)',
      POLISH: 'Polish (Polski)',
      GERMAN: 'German (Deutsch)',
      FRENCH: 'French (Français)',
      SPANISH: 'Spanish (Español)',
      ITALIAN: 'Italian (Italiano)',
      PORTUGUESE: 'Portuguese (Português)',
      DUTCH: 'Dutch (Nederlands)',
      SWEDISH: 'Swedish (Svenska)',
      NORWEGIAN: 'Norwegian (Norsk)',
      DANISH: 'Danish (Dansk)',
      FINNISH: 'Finnish (Suomi)',
      CZECH: 'Czech (Čeština)',
    };

    const languageName = languageMap[brand.language] || brand.language;

    return `You are an expert marketing strategist. Generate content for the following brand:
Name: ${brand.name}
Industry: ${brand.industry || 'N/A'}
Target Audience: ${brand.targetAudience || 'General audience'}
Tone: ${brand.tone}
Content Language: ${languageName}
Brand Colors: ${brand.brandColors?.join(', ') || 'N/A'}
Location: ${brand.city}, ${brand.country}

CRITICAL REQUIREMENTS:
- ALL content MUST be written in ${languageName}
- Respond ONLY with valid JSON matching the requested schema
- Maintain tone: ${brand.tone}
- Do not invent false claims; use placeholders if information is missing
- Be specific and actionable
- Use native language expressions and idioms appropriate for ${languageName}`;
  }

  async generateStrategy(projectId: string, userId: string): Promise<any> {
    const brand = await this.getBrandContext(projectId, userId);

    const userPrompt = `Generate a comprehensive 30-day marketing strategy for ${brand.name}. 
Include:
- Overview of the strategy
- Target audience analysis
- Key messages (3-5)
- 4 weekly plans, each with:
  - Week number (1-4)
  - Main focus area
  - Specific goals (3-4)
  - Tactics to implement (3-5)
  - KPIs to track (3-4)

Return as JSON with structure: { overview, targetAudience, keyMessages: [], weeks: [{week, focus, goals: [], tactics: [], kpis: []}] }`;

    const strategy: Strategy = await this.openai.generateWithSchema(
      this.buildSystemPrompt(brand),
      userPrompt,
      StrategySchema
    );

    const contentItem = await this.prisma.contentItem.create({
      data: {
        type: 'STRATEGY',
        title: '30-Day Marketing Strategy',
        content: strategy,
        projectId,
      },
    });

    await this.auditService.log(userId, 'AI_STRATEGY_GENERATED', { projectId, contentItemId: contentItem.id });

    return contentItem;
  }

  async generateCalendar(projectId: string, userId: string): Promise<any> {
    const brand = await this.getBrandContext(projectId, userId);

    const userPrompt = `Generate a 4-week content calendar for ${brand.name}.
For each week (7 days), suggest 3-4 posts across different platforms (Instagram, Facebook, LinkedIn, TikTok).

Return as JSON: { month: "current_month", items: [{date: "YYYY-MM-DD", platform, contentType, topic, hashtags: [], notes}] }`;

    const calendar: Calendar = await this.openai.generateWithSchema(
      this.buildSystemPrompt(brand),
      userPrompt,
      CalendarSchema
    );

    const contentItem = await this.prisma.contentItem.create({
      data: {
        type: 'CALENDAR',
        title: '4-Week Content Calendar',
        content: calendar,
        projectId,
      },
    });

    await this.auditService.log(userId, 'AI_CALENDAR_GENERATED', { projectId, contentItemId: contentItem.id });

    return contentItem;
  }

  async generatePosts(projectId: string, userId: string): Promise<any> {
    const brand = await this.getBrandContext(projectId, userId);

    const userPrompt = `Generate 20 social media posts for ${brand.name}.
Mix of platforms: Instagram, Facebook, LinkedIn, TikTok.
Each post should include:
- platform
- caption (compelling, on-brand)
- hashtags array (5-10 relevant)
- cta (call to action)
- imagePrompt (description for image generation, optional)
- bestTimeToPost (optional suggestion)

Return as JSON: { posts: [{platform, caption, hashtags: [], cta, imagePrompt?, bestTimeToPost?}], theme?: "optional theme" }`;

    const postPack: PostPack = await this.openai.generateWithSchema(
      this.buildSystemPrompt(brand),
      userPrompt,
      PostPackSchema
    );

    const batch = await this.prisma.contentBatch.create({
      data: {
        name: '20 Social Media Posts',
        description: `Generated post pack for ${brand.name}`,
        projectId,
      },
    });

    const items = await Promise.all(
      postPack.posts.map((post, index) =>
        this.prisma.contentItem.create({
          data: {
            type: 'POST',
            title: `${post.platform} Post ${index + 1}`,
            content: post,
            projectId,
            batchId: batch.id,
          },
        })
      )
    );

    await this.auditService.log(userId, 'AI_POSTS_GENERATED', { projectId, batchId: batch.id, count: items.length });

    return { batch, items };
  }

  async generateReels(projectId: string, userId: string): Promise<any> {
    const brand = await this.getBrandContext(projectId, userId);

    const userPrompt = `Generate 8 Reels/TikTok video scripts for ${brand.name}.
Each script should include:
- title (catchy)
- hook (first 3 seconds to grab attention)
- scenes array: [{duration: "3s", visual: "what viewer sees", action: "what happens"}]
- voiceover (full script narration)
- onScreenText array (text overlays for each scene)
- cta (call to action at end)
- hashtags array
- music (suggested music vibe, optional)

Return as JSON: { scripts: [{title, hook, scenes: [], voiceover, onScreenText: [], cta, hashtags: [], music?}] }`;

    const reelsPack: ReelsPack = await this.openai.generateWithSchema(
      this.buildSystemPrompt(brand),
      userPrompt,
      ReelsPackSchema
    );

    const batch = await this.prisma.contentBatch.create({
      data: {
        name: '8 Reels Scripts',
        description: `Generated reels scripts for ${brand.name}`,
        projectId,
      },
    });

    const items = await Promise.all(
      reelsPack.scripts.map((script, index) =>
        this.prisma.contentItem.create({
          data: {
            type: 'REEL_SCRIPT',
            title: script.title,
            content: script,
            projectId,
            batchId: batch.id,
          },
        })
      )
    );

    await this.auditService.log(userId, 'AI_REELS_GENERATED', { projectId, batchId: batch.id, count: items.length });

    return { batch, items };
  }

  async generateInsights(projectId: string, userId: string, analyticsData?: any): Promise<any> {
    const brand = await this.getBrandContext(projectId, userId);

    const analyticsContext = analyticsData
      ? `Analytics data: ${JSON.stringify(analyticsData)}`
      : 'No analytics data available yet - provide general insights based on industry best practices.';

    const userPrompt = `Based on ${brand.name}'s marketing activities, generate weekly insights and recommendations.
${analyticsContext}

Return as JSON: {
  period: "Week of YYYY-MM-DD",
  insights: [{title, description, impact: "high"|"medium"|"low", metric?}],
  recommendations: [{title, description, priority: "high"|"medium"|"low", category}],
  summary: "overall summary paragraph"
}

Provide 5 insights and 5 recommendations.`;

    const insights: WeeklyInsights = await this.openai.generateWithSchema(
      this.buildSystemPrompt(brand),
      userPrompt,
      WeeklyInsightsSchema
    );

    const contentItem = await this.prisma.contentItem.create({
      data: {
        type: 'INSIGHT',
        title: 'Weekly Insights & Recommendations',
        content: insights,
        projectId,
      },
    });

    await this.auditService.log(userId, 'AI_INSIGHTS_GENERATED', { projectId, contentItemId: contentItem.id });

    return contentItem;
  }
}
