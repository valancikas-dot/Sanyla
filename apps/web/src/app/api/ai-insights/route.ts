import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';
import OpenAI from 'openai';

function generateId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
  return new OpenAI({ apiKey });
}

// POST /api/ai-insights/analyze - Generate AI insights for a project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const pool = getPool();

    // Get project details
    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectResult.rows[0];

    // Get content performance data
    const analyticsResult = await pool.query(`
      SELECT 
        ca.*,
        cc.platform,
        cc."contentType",
        cc.caption,
        cc."scheduledDate"
      FROM content_analytics ca
      JOIN content_calendar cc ON ca."contentId" = cc.id
      WHERE cc."projectId" = $1
      ORDER BY ca."dataFetchedAt" DESC
      LIMIT 100
    `, [projectId]);

    // Get recent content
    const contentResult = await pool.query(`
      SELECT * FROM content_calendar
      WHERE "projectId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 30
    `, [projectId]);

    const openai = getOpenAI();

    // Analyze with GPT-4
    const analysisPrompt = `You are an expert social media marketing analyst.

Analyze this project's performance and provide actionable insights:

Project: ${project.name}
Industry: ${project.industry}
Target Audience: ${project.targetAudience}

Recent Content (${contentResult.rows.length} posts):
${contentResult.rows.slice(0, 10).map(c => 
  `- ${c.platform} ${c.contentType}: "${c.caption}" (${c.status})`
).join('\n')}

Performance Data (${analyticsResult.rows.length} posts with analytics):
${analyticsResult.rows.slice(0, 10).map(a => 
  `- ${a.platform}: ${a.impressions || 0} impressions, ${a.engagement || 0} engagement, ${a.engagementRate || 0}% rate`
).join('\n')}

Provide 5-7 specific insights as JSON array:
[
  {
    "type": "content_recommendation|posting_time|audience_behavior|performance",
    "title": "Short actionable title",
    "description": "Detailed explanation with data",
    "priority": "low|medium|high|critical",
    "actionItems": ["Action 1", "Action 2"]
  }
]

Focus on:
1. Best performing content types and why
2. Optimal posting times
3. Audience engagement patterns
4. Content improvement suggestions
5. Platform-specific recommendations

Return ONLY valid JSON, no markdown.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a data analyst. Return ONLY valid JSON.' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    let insights: any[] = [];
    try {
      const responseText = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(responseText);
      insights = parsed.insights || parsed.recommendations || [];
    } catch (e) {
      console.error('Failed to parse insights:', e);
      return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }

    // Save insights to database
    const savedInsights = [];
    for (const insight of insights) {
      const id = generateId();
      
      await pool.query(`
        INSERT INTO ai_insights (
          id, "projectId", "insightType", title, description,
          priority, "actionItems", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        id,
        projectId,
        insight.type || 'content_recommendation',
        insight.title,
        insight.description,
        insight.priority || 'medium',
        insight.actionItems || []
      ]);

      savedInsights.push({ id, ...insight });
    }

    return NextResponse.json({ 
      success: true,
      insights: savedInsights,
      total: savedInsights.length
    });

  } catch (error: any) {
    console.error('AI insights error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate insights'
    }, { status: 500 });
  }
}

// GET /api/ai-insights?projectId=xxx - Get insights for a project
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const pool = getPool();
    
    let query = `
      SELECT * FROM ai_insights 
      WHERE "projectId" = $1
    `;
    
    if (unreadOnly) {
      query += ` AND "isRead" = false`;
    }

    query += ` ORDER BY priority DESC, "createdAt" DESC`;

    const result = await pool.query(query, [projectId]);

    return NextResponse.json({ 
      insights: result.rows,
      total: result.rows.length,
      unread: result.rows.filter((r: any) => !r.isRead).length
    });

  } catch (error: any) {
    console.error('Get insights error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch insights'
    }, { status: 500 });
  }
}
