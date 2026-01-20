import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Storage service for R2/S3
import { uploadImageToStorage } from '@/lib/storage';

// Initialize OpenAI
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

interface ProjectContext {
  name?: string;
  industry?: string;
  offer?: string;
  targetAudience?: string;
  tone?: string;
  website?: string;
  language?: string;
}

interface DayContent {
  day: number;
  theme: string;
  date: string;
  bestTime: string;
  instagram: {
    caption: string;
    reelsText: string;
    reelsCover?: string; // PERMANENT R2 URL
    reelsCoverKey?: string; // R2 object key
    filmingInstruction: string;
    hashtags: string;
  };
  facebook: {
    post: string;
    cta: string;
    visual?: string; // PERMANENT R2 URL
    visualKey?: string;
  };
  linkedin: {
    post: string;
    angle: string;
    visual?: string; // PERMANENT R2 URL
    visualKey?: string;
  };
  tiktok?: {
    caption: string;
    hashtags: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, prompt, autoGenerateImages = true } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    // Check user credits/limits
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
    });

    // Simple rate limit: max 1 campaign per day (for free users)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const campaignsToday = await prisma.content_batches.count({
      where: {
        project: {
          organization: {
            memberships: {
              some: { userId: user?.id }
            }
          }
        },
        createdAt: { gte: today }
      }
    });

    if (campaignsToday >= 1) {
      return NextResponse.json({ 
        error: 'Daily limit reached. You can generate 1 campaign per day on the free plan.',
        limit: 'DAILY_LIMIT_REACHED'
      }, { status: 429 });
    }

    // Get project details
    const project = await prisma.projects.findUnique({
      where: { id: projectId },
      include: { organization: true }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectContext: ProjectContext = {
      name: project.name,
      industry: project.industry || undefined,
      offer: project.offer || undefined,
      targetAudience: project.targetAudience || undefined,
      tone: project.tone || 'professional',
      website: project.website || undefined,
      language: project.language || 'lt',
    };

    const openai = getOpenAI();

    // Step 1: Generate campaign content with GPT-4
    console.log('🤖 Generating campaign content...');
    const campaignContent = await generateFullCampaign(openai, prompt, projectContext);
    
    // Step 2: Parse the generated content into structured days
    console.log('📋 Parsing campaign structure...');
    const parsedDays = await parseCampaignContent(campaignContent, projectContext);

    // Step 3: Generate DALL-E images + SAVE TO R2
    let daysWithImages = parsedDays;
    if (autoGenerateImages) {
      console.log('🎨 Generating DALL-E images and saving to storage...');
      daysWithImages = await generateAndSaveImages(
        openai, 
        parsedDays, 
        projectContext,
        projectId,
        user?.id || 'anonymous'
      );
    }

    // Step 4: Create ContentBatch
    const batch = await prisma.content_batches.create({
      data: {
        name: `7-Day Campaign - ${new Date().toLocaleDateString('lt-LT')}`,
        description: prompt || 'AI-generated 7-day social media campaign',
        projectId: project.id,
      }
    });

    // Step 5: Save each day as ContentItem + Assets + ScheduleJobs
    console.log('💾 Saving to database...');
    const savedItems = await saveCampaignToDatabase(daysWithImages, project.id, batch.id);

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      totalDays: daysWithImages.length,
      items: savedItems,
      preview: daysWithImages,
      message: 'Campaign generated successfully! Images saved permanently.',
      status: 'DRAFT', // User needs to connect IG and schedule
    });

  } catch (error: any) {
    console.error('Campaign auto-generate error:', error);
    
    if (error.message?.includes('Daily limit')) {
      return NextResponse.json({
        error: error.message,
        limit: 'DAILY_LIMIT_REACHED'
      }, { status: 429 });
    }
    
    return NextResponse.json({
      error: error.message || 'Campaign generation failed',
      details: error.toString()
    }, { status: 500 });
  }
}

// ... (keep existing helper functions: generateFullCampaign, parseCampaignContent, etc.)

/**
 * NEW: Generate images with DALL-E and save to R2 immediately
 */
async function generateAndSaveImages(
  openai: OpenAI,
  days: DayContent[],
  context: ProjectContext,
  projectId: string,
  userId: string,
): Promise<DayContent[]> {
  const updatedDays = [...days];

  for (let i = 0; i < updatedDays.length; i++) {
    const day = updatedDays[i];
    console.log(`🎨 Day ${day.day}: Generating and saving images...`);

    try {
      // Instagram Reels cover
      const reelsCoverPrompt = `Professional social media Reels cover for ${context.industry} business. 
Theme: ${day.theme}. 
Style: Modern, eye-catching, vertical 9:16 ratio, bold colors.
Content: ${day.instagram.caption.substring(0, 100)}`;

      const reelsCoverTemp = await generateSingleImage(openai, reelsCoverPrompt);
      
      if (reelsCoverTemp) {
        const saved = await uploadImageToStorage(
          reelsCoverTemp, 
          `${userId}/${projectId}/day${day.day}/instagram-reels.png`
        );
        day.instagram.reelsCover = saved.url;
        day.instagram.reelsCoverKey = saved.key;
      }

      // Facebook visual
      const fbPrompt = `Professional Facebook post image for ${context.industry}.
Theme: ${day.theme}.
Style: Clean, modern, engaging, 1200x628 ratio.`;

      const fbTemp = await generateSingleImage(openai, fbPrompt);
      
      if (fbTemp) {
        const saved = await uploadImageToStorage(
          fbTemp,
          `${userId}/${projectId}/day${day.day}/facebook.png`
        );
        day.facebook.visual = saved.url;
        day.facebook.visualKey = saved.key;
      }

      // LinkedIn visual
      const liPrompt = `Professional LinkedIn infographic for ${context.industry}.
Theme: ${day.theme}.
Style: Corporate, data-driven, professional.`;

      const liTemp = await generateSingleImage(openai, liPrompt);
      
      if (liTemp) {
        const saved = await uploadImageToStorage(
          liTemp,
          `${userId}/${projectId}/day${day.day}/linkedin.png`
        );
        day.linkedin.visual = saved.url;
        day.linkedin.visualKey = saved.key;
      }

      // Rate limit delay
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Failed images for Day ${day.day}:`, error);
      // Continue with nulls
    }
  }

  return updatedDays;
}

async function generateSingleImage(openai: OpenAI, prompt: string): Promise<string | null> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    });

    return response.data?.[0]?.url || null;
  } catch (error) {
    console.error('DALL-E error:', error);
    return null;
  }
}

// Keep other functions from original file...
async function generateFullCampaign(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  const language = context.language || 'lt';
  const languageName = getLanguageName(language);

  const systemPrompt = `You are a professional social media content creator.

🚨 CRITICAL: Generate ALL content in ${languageName} language.

Project: ${context.name}
Industry: ${context.industry}
Target: ${context.targetAudience}
Tone: ${context.tone}

Create 7 COMPLETE days of social media content. For each day, provide:

**DAY X - [Theme]**
📅 Date: [Suggested date]
⏰ Best time: [Time]

📱 INSTAGRAM/REELS:
Caption: [2-3 engaging sentences in ${languageName}]
Reels screen text: [5-7 words max]
Filming: [Quick instruction OR "Use generated image"]
Hashtags: [20-30 hashtags in ${languageName}]

📘 FACEBOOK:
Post: [3-4 sentences in ${languageName}]
CTA: [Call to action in ${languageName}]

💼 LINKEDIN:
Post: [4-5 professional sentences in ${languageName}]
Angle: [Professional angle]

📱 TIKTOK:
Caption: [Short, catchy in ${languageName}]
Hashtags: [10-15 trending hashtags]

---

Repeat for all 7 days. Mix content types: educational (40%), promotional (30%), engagement (20%), behind-scenes (10%).`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || `Sukurk 7 dienų socialinių tinklų kampaniją ${languageName} kalba` }
    ],
    temperature: 0.8,
    max_tokens: 4096,
  });

  return response.choices[0]?.message?.content || '';
}

async function parseCampaignContent(content: string, context: ProjectContext): Promise<DayContent[]> {
  const days: DayContent[] = [];
  const dayBlocks = content.split(/DAY \d+/i).filter(block => block.trim());

  for (let i = 0; i < Math.min(dayBlocks.length, 7); i++) {
    const block = dayBlocks[i];
    
    const instagramMatch = block.match(/INSTAGRAM\/REELS:([\s\S]*?)(?=FACEBOOK:|$)/i);
    const facebookMatch = block.match(/FACEBOOK:([\s\S]*?)(?=LINKEDIN:|$)/i);
    const linkedinMatch = block.match(/LINKEDIN:([\s\S]*?)(?=TIKTOK:|$)/i);
    const tiktokMatch = block.match(/TIKTOK:([\s\S]*?)(?=---|$)/i);

    days.push({
      day: i + 1,
      theme: extractTheme(block),
      date: getScheduledDate(i),
      bestTime: extractBestTime(block),
      instagram: {
        caption: extractValue(instagramMatch?.[1] || '', 'Caption:'),
        reelsText: extractValue(instagramMatch?.[1] || '', 'Reels screen text:'),
        filmingInstruction: extractValue(instagramMatch?.[1] || '', 'Filming:'),
        hashtags: extractValue(instagramMatch?.[1] || '', 'Hashtags:'),
      },
      facebook: {
        post: extractValue(facebookMatch?.[1] || '', 'Post:'),
        cta: extractValue(facebookMatch?.[1] || '', 'CTA:'),
      },
      linkedin: {
        post: extractValue(linkedinMatch?.[1] || '', 'Post:'),
        angle: extractValue(linkedinMatch?.[1] || '', 'Angle:'),
      },
      tiktok: tiktokMatch ? {
        caption: extractValue(tiktokMatch[1], 'Caption:'),
        hashtags: extractValue(tiktokMatch[1], 'Hashtags:'),
      } : undefined,
    });
  }

  return days;
}

async function saveCampaignToDatabase(
  days: DayContent[],
  projectId: string,
  batchId: string
) {
  const savedItems = [];

  for (const day of days) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + day.day);
    
    // Instagram/Reels
    const instagramItem = await prisma.content_items.create({
      data: {
        type: 'REEL_SCRIPT',
        title: `Day ${day.day} - Instagram Reels - ${day.theme}`,
        content: {
          platform: 'instagram',
          caption: day.instagram.caption,
          reelsText: day.instagram.reelsText,
          hashtags: day.instagram.hashtags,
          coverImage: day.instagram.reelsCover, // PERMANENT R2 URL
          coverImageKey: day.instagram.reelsCoverKey,
          filmingInstruction: day.instagram.filmingInstruction,
        },
        metadata: {
          day: day.day,
          theme: day.theme,
          bestTime: day.bestTime,
        },
        projectId,
        batchId,
      }
    });

    // Save as Asset for tracking
    if (day.instagram.reelsCover && day.instagram.reelsCoverKey) {
      await prisma.asset.create({
        data: {
          type: 'image',
          filename: `day${day.day}-instagram-reels.png`,
          path: day.instagram.reelsCoverKey,
          mimeType: 'image/png',
          projectId,
        }
      });
    }

    // Create schedule job (DRAFT status)
    await prisma.schedule_jobs.create({
      data: {
        scheduledFor: new Date(`${day.date} ${day.bestTime}`),
        platform: 'META',
        status: 'DRAFT', // User must schedule manually
        contentItemId: instagramItem.id,
        projectId,
        payload: {
          type: 'instagram_image',
          caption: day.instagram.caption,
          mediaUrl: day.instagram.reelsCover,
        }
      }
    });

    // Facebook (similar pattern)
    const facebookItem = await prisma.content_items.create({
      data: {
        type: 'POST',
        title: `Day ${day.day} - Facebook - ${day.theme}`,
        content: {
          platform: 'facebook',
          post: day.facebook.post,
          cta: day.facebook.cta,
          image: day.facebook.visual,
          imageKey: day.facebook.visualKey,
        },
        metadata: { day: day.day, theme: day.theme },
        projectId,
        batchId,
      }
    });

    if (day.facebook.visual && day.facebook.visualKey) {
      await prisma.asset.create({
        data: {
          type: 'image',
          filename: `day${day.day}-facebook.png`,
          path: day.facebook.visualKey,
          mimeType: 'image/png',
          projectId,
        }
      });
    }

    await prisma.schedule_jobs.create({
      data: {
        scheduledFor: new Date(`${day.date} ${day.bestTime}`),
        platform: 'META',
        status: 'DRAFT',
        contentItemId: facebookItem.id,
        projectId,
        payload: {
          type: 'facebook_post',
          text: day.facebook.post,
          mediaUrl: day.facebook.visual,
        }
      }
    });

    // LinkedIn (similar pattern)
    const linkedinItem = await prisma.content_items.create({
      data: {
        type: 'POST',
        title: `Day ${day.day} - LinkedIn - ${day.theme}`,
        content: {
          platform: 'linkedin',
          post: day.linkedin.post,
          angle: day.linkedin.angle,
          image: day.linkedin.visual,
          imageKey: day.linkedin.visualKey,
        },
        metadata: { day: day.day, theme: day.theme },
        projectId,
        batchId,
      }
    });

    if (day.linkedin.visual && day.linkedin.visualKey) {
      await prisma.asset.create({
        data: {
          type: 'image',
          filename: `day${day.day}-linkedin.png`,
          path: day.linkedin.visualKey,
          mimeType: 'image/png',
          projectId,
        }
      });
    }

    await prisma.schedule_jobs.create({
      data: {
        scheduledFor: new Date(`${day.date} ${day.bestTime}`),
        platform: 'LINKEDIN',
        status: 'DRAFT',
        contentItemId: linkedinItem.id,
        projectId,
        payload: {
          type: 'linkedin_post',
          text: day.linkedin.post,
          mediaUrl: day.linkedin.visual,
        }
      }
    });

    savedItems.push({ day: day.day, theme: day.theme, items: 3 });
  }

  return savedItems;
}

// Helper functions
function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    'lt': 'Lithuanian', 'en': 'English', 'de': 'German', 'fr': 'French',
    'es': 'Spanish', 'it': 'Italian', 'pl': 'Polish', 'nl': 'Dutch',
  };
  return names[code] || 'English';
}

function extractTheme(block: string): string {
  const match = block.match(/(?:DAY \d+ - |^\s*)([^\n]+)/i);
  return match?.[1]?.trim().replace(/[*#]/g, '') || 'Social Media Post';
}

function extractBestTime(block: string): string {
  const match = block.match(/(?:Best time:|⏰)[:\s]*([^\n]+)/i);
  return match?.[1]?.trim() || '10:00';
}

function extractValue(text: string, label: string): string {
  const regex = new RegExp(`${label}[:\\s]*([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match?.[1]?.trim() || '';
}

function getScheduledDate(dayIndex: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dayIndex + 1);
  return date.toISOString().split('T')[0];
}
