import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';
import OpenAI from 'openai';

// Generate ID
function generateId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
  return new OpenAI({ apiKey });
}

// POST /api/content-calendar/generate - Generate 30-day content calendar
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, platforms, contentTypes, postsPerWeek } = await req.json();

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
    const openai = getOpenAI();

    // Generate 30-day content strategy with GPT-4
    const strategyPrompt = `You are a professional social media marketing strategist.

Create a detailed 30-day content calendar for:
- Business: ${project.name}
- Industry: ${project.industry || 'General'}
- Target Audience: ${project.targetAudience || 'General public'}
- Tone: ${project.tone}
- Platforms: ${platforms?.join(', ') || 'Facebook, Instagram, LinkedIn'}
- Posts per week: ${postsPerWeek || 7}

For EACH day (Day 1 to Day 30), provide:
1. Content type (post/story/reel)
2. Platform (facebook/instagram/linkedin/tiktok)
3. Main topic/theme
4. Caption (50-150 characters, engaging, with emojis)
5. Hashtags (5-10 relevant ones)
6. Best posting time (HH:MM format)
7. Visual description for AI image generation

Return as JSON array with this exact structure:
[
  {
    "day": 1,
    "contentType": "post",
    "platform": "instagram",
    "topic": "Brand introduction",
    "caption": "Welcome message here 👋",
    "hashtags": ["#brand", "#welcome"],
    "postingTime": "10:00",
    "visualDescription": "Professional photo of product"
  },
  ...
]

Generate exactly 30 items. Be strategic - mix content types, vary platforms, and create an engaging narrative arc across the month.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a social media content strategist. Return ONLY valid JSON, no markdown, no explanations.' },
        { role: 'user', content: strategyPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    let contentPlan;
    try {
      const responseText = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(responseText);
      contentPlan = parsed.calendar || parsed.content || parsed.posts || [];
    } catch (e) {
      console.error('Failed to parse GPT response:', e);
      return NextResponse.json({ error: 'Failed to generate content plan' }, { status: 500 });
    }

    if (!Array.isArray(contentPlan) || contentPlan.length === 0) {
      return NextResponse.json({ error: 'Invalid content plan generated' }, { status: 500 });
    }

    // Insert into database
    const startDate = new Date();
    const insertedContent = [];

    for (let i = 0; i < contentPlan.length && i < 30; i++) {
      const item = contentPlan[i];
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(startDate.getDate() + i);

      const id = generateId();
      
      await pool.query(`
        INSERT INTO content_calendar (
          id, "projectId", "scheduledDate", "contentType", platform, 
          status, caption, hashtags, "targetAudience", "postingTime", 
          "aiGenerated", "mediaType", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      `, [
        id,
        projectId,
        scheduledDate.toISOString().split('T')[0],
        item.contentType || 'post',
        item.platform || 'instagram',
        'pending_approval',
        item.caption || '',
        item.hashtags || [],
        project.targetAudience,
        item.postingTime || '10:00',
        true,
        item.contentType === 'reel' ? 'video' : 'image'
      ]);

      insertedContent.push({
        id,
        day: i + 1,
        date: scheduledDate.toISOString().split('T')[0],
        ...item
      });
    }

    return NextResponse.json({ 
      success: true,
      message: `Generated ${insertedContent.length} content items for 30 days`,
      content: insertedContent
    });

  } catch (error: any) {
    console.error('Content calendar generation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate content calendar',
      details: error.toString()
    }, { status: 500 });
  }
}

// GET /api/content-calendar?projectId=xxx - Get content calendar
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status'); // draft, pending_approval, approved, posted

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const pool = getPool();
    
    let query = `
      SELECT * FROM content_calendar 
      WHERE "projectId" = $1
    `;
    const params: any[] = [projectId];

    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY "scheduledDate" ASC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ 
      content: result.rows,
      total: result.rows.length
    });

  } catch (error: any) {
    console.error('Get content calendar error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch content calendar'
    }, { status: 500 });
  }
}
