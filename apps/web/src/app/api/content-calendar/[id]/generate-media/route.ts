import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';
import OpenAI from 'openai';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
  return new OpenAI({ apiKey });
}

// POST /api/content-calendar/[id]/generate-media - Generate image/video for content
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentId = params.id;
    const pool = getPool();

    // Get content and project details
    const contentResult = await pool.query(`
      SELECT cc.*, p.name as project_name, p.industry, p.tone, p.language
      FROM content_calendar cc
      JOIN projects p ON cc."projectId" = p.id
      WHERE cc.id = $1
    `, [contentId]);

    if (contentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const content = contentResult.rows[0];
    const openai = getOpenAI();

    let mediaUrls: string[] = [];

    // Generate media based on content type
    if (content.contentType === 'reel' || content.mediaType === 'video') {
      // For now, return a placeholder - video generation requires different API
      mediaUrls = ['https://placeholder-video.com/reel.mp4'];
      
    } else {
      // Generate image with DALL-E
      const imagePrompt = `Create a professional ${content.platform} post image for:
Business: ${content.project_name}
Industry: ${content.industry}
Caption: ${content.caption}
Tone: ${content.tone}

Style: Modern, eye-catching, suitable for ${content.platform}. High quality marketing visual.`;

      try {
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
          style: 'vivid',
        });

        const imageUrl = imageResponse.data?.[0]?.url;
        if (imageUrl) {
          mediaUrls = [imageUrl];
        }
      } catch (error: any) {
        console.error('DALL-E error:', error);
        return NextResponse.json({ 
          error: 'Failed to generate image: ' + error.message 
        }, { status: 500 });
      }
    }

    // Update content with media URLs
    await pool.query(`
      UPDATE content_calendar 
      SET "mediaUrls" = $1, "updatedAt" = NOW()
      WHERE id = $2
    `, [mediaUrls, contentId]);

    return NextResponse.json({ 
      success: true,
      mediaUrls,
      message: 'Media generated successfully'
    });

  } catch (error: any) {
    console.error('Generate media error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate media'
    }, { status: 500 });
  }
}
