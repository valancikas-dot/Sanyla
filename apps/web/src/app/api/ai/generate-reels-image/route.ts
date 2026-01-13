import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, type = 'reels' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const openai = getOpenAI();

    // Generate image with DALL-E 3
    // For Reels: 1024x1792 (9:16 vertical)
    // For square posts: 1024x1024
    const size = type === 'reels' ? '1024x1792' : '1024x1024';

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size as '1024x1024' | '1024x1792',
      quality: 'hd',
      style: 'vivid',
    });

    if (!imageResponse.data || imageResponse.data.length === 0) {
      throw new Error('Failed to generate image');
    }

    const imageUrl = imageResponse.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Failed to generate image URL');
    }

    return NextResponse.json({ 
      imageUrl,
      revisedPrompt: imageResponse.data[0]?.revised_prompt,
      size,
    });

  } catch (error: any) {
    console.error('Reels image generation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate Reels image',
      details: error.toString()
    }, { status: 500 });
  }
}
