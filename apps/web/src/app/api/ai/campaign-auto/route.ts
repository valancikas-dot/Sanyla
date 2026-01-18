import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { uploadImageToStorage } from '@/lib/storage';
import { parseAndValidateDate, addDays } from '@/lib/utils/date-validation';

const prisma = new PrismaClient();

// AI Credits Cost Configuration
const CAMPAIGN_CREDIT_COST = 30; // Credits required to generate one 7-day campaign

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
    reelsCoverKey?: string; // R2 object key for deletion
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

/**
 * POST /api/ai/campaign-auto
 * 
 * Generates a complete 7-day campaign with:
 * - AI-generated content for all platforms
 * - DALL-E images automatically generated
 * - Saved as DRAFT posts in database
 * - Returns preview for approval
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      projectId, 
      prompt, 
      autoGenerateImages = true,
      startAt,
      timezone = 'Europe/Vilnius'
    } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    // Validate startAt if provided
    if (!startAt) {
      return NextResponse.json({ 
        error: 'Missing startAt: Please select a start date and time for the campaign' 
      }, { status: 400 });
    }

    let campaignStartDate: Date;
    try {
      campaignStartDate = parseAndValidateDate(startAt, 'startAt');
      
      // Validate it's a future date
      if (campaignStartDate < new Date()) {
        return NextResponse.json({ 
          error: 'Invalid startAt: Start date must be in the future' 
        }, { status: 400 });
      }
    } catch (error: any) {
      return NextResponse.json({ 
        error: error.message || 'Invalid startAt date format' 
      }, { status: 400 });
    }

    // ==========================================
    // PHASE 1B: AI CREDIT CHECK
    // ==========================================
    // Get user with credit information
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        aiCredits: true, 
        creditsPlan: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has sufficient credits BEFORE generating anything
    if (user.aiCredits < CAMPAIGN_CREDIT_COST) {
      return NextResponse.json({
        error: 'Insufficient AI credits',
        code: 'INSUFFICIENT_CREDITS',
        available: user.aiCredits,
        required: CAMPAIGN_CREDIT_COST,
        message: `You need ${CAMPAIGN_CREDIT_COST} credits to generate a campaign. You have ${user.aiCredits} credits remaining.`
      }, { status: 402 }); // 402 Payment Required
    }

    console.log(`✅ Credit check passed: User ${user.email} has ${user.aiCredits} credits (required: ${CAMPAIGN_CREDIT_COST})`);
    // ==========================================

    // Get project details
    const project = await prisma.project.findUnique({
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

    // Step 3: Generate DALL-E images for each day (if enabled)
    let daysWithImages = parsedDays;
    if (autoGenerateImages) {
      console.log('🎨 Generating DALL-E images and saving to R2...');
      daysWithImages = await generateImagesForDays(
        openai, 
        parsedDays, 
        projectContext,
        project.id,
        user?.id || 'anonymous'
      );
    }

    // Step 4: Create ContentBatch
    const batch = await prisma.contentBatch.create({
      data: {
        name: `7-Day Campaign - ${new Date().toLocaleDateString('lt-LT')}`,
        description: prompt || 'AI-generated 7-day social media campaign',
        projectId: project.id,
      }
    });

    // Step 5: Save each day as ContentItem + ScheduleJobs (with validated start date)
    console.log('💾 Saving to database with schedule starting:', campaignStartDate.toISOString());
    const savedItems = await saveCampaignToDatabase(
      daysWithImages, 
      project.id, 
      batch.id, 
      campaignStartDate,
      timezone
    );

    // ==========================================
    // PHASE 1B: DEDUCT CREDITS & CREATE RECORDS
    // ==========================================
    // Only after SUCCESSFUL generation - deduct credits in a transaction
    console.log(`💳 Deducting ${CAMPAIGN_CREDIT_COST} credits from user ${user.email}...`);
    
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Create Campaign record
      const campaign = await tx.campaign.create({
        data: {
          name: `7-Day Campaign - ${new Date().toLocaleDateString('lt-LT')}`,
          prompt: prompt || 'AI-generated campaign',
          aiCost: CAMPAIGN_CREDIT_COST,
          status: 'DRAFT', // Campaign is in DRAFT until user approves
          userId: user.id,
          projectId: project.id,
          batchId: batch.id,
        }
      });

      // 2. Deduct credits from user
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          aiCredits: {
            decrement: CAMPAIGN_CREDIT_COST
          }
        },
        select: { aiCredits: true }
      });

      // 3. Create credit usage log
      await tx.creditLog.create({
        data: {
          action: 'CAMPAIGN_GENERATE',
          cost: CAMPAIGN_CREDIT_COST,
          userId: user.id,
          metadata: {
            projectId: project.id,
            campaignId: campaign.id,
            batchId: batch.id,
            prompt: prompt,
            daysGenerated: daysWithImages.length,
            imagesGenerated: autoGenerateImages,
          }
        }
      });

      return {
        campaignId: campaign.id,
        remainingCredits: updatedUser.aiCredits
      };
    });

    console.log(`✅ Credits deducted successfully. Remaining: ${transactionResult.remainingCredits}`);
    // ==========================================

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      campaignId: transactionResult.campaignId,
      totalDays: daysWithImages.length,
      items: savedItems,
      preview: daysWithImages,
      creditsUsed: CAMPAIGN_CREDIT_COST,
      creditsRemaining: transactionResult.remainingCredits,
      message: 'Campaign generated successfully! Review and approve to schedule.',
    });

  } catch (error: any) {
    console.error('Campaign auto-generate error:', error);
    return NextResponse.json({
      error: error.message || 'Campaign generation failed',
      details: error.toString()
    }, { status: 500 });
  }
}

async function generateFullCampaign(
  openai: OpenAI, 
  prompt: string, 
  context: ProjectContext
): Promise<string> {
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

async function parseCampaignContent(
  content: string, 
  context: ProjectContext
): Promise<DayContent[]> {
  // Simple parsing logic - split by DAY markers
  const days: DayContent[] = [];
  const dayBlocks = content.split(/DAY \d+/i).filter(block => block.trim());

  for (let i = 0; i < Math.min(dayBlocks.length, 7); i++) {
    const block = dayBlocks[i];
    
    // Extract sections
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

async function generateImagesForDays(
  openai: OpenAI,
  days: DayContent[],
  context: ProjectContext,
  projectId: string,
  userId: string
): Promise<DayContent[]> {
  const updatedDays = [...days];

  for (let i = 0; i < updatedDays.length; i++) {
    const day = updatedDays[i];
    console.log(`🎨 Day ${day.day}: Generating images and saving to R2...`);

    try {
      // Generate Instagram Reels cover
      const reelsCoverPrompt = `Professional social media Reels cover for ${context.industry} business. 
Theme: ${day.theme}. 
Style: Modern, eye-catching, vertical 9:16 ratio, bold colors.
Content: ${day.instagram.caption.substring(0, 100)}`;

      const reelsCoverTemp = await generateSingleImage(openai, reelsCoverPrompt);
      
      // CRITICAL FIX: Save to R2 immediately to prevent URL expiration
      if (reelsCoverTemp) {
        const saved = await uploadImageToStorage(
          reelsCoverTemp,
          `${userId}/${projectId}/day${day.day}/instagram-reels.png`
        );
        day.instagram.reelsCover = saved.url; // PERMANENT URL
        day.instagram.reelsCoverKey = saved.key; // For deletion later
      }

      // Generate Facebook visual
      const fbPrompt = `Professional Facebook post image for ${context.industry}.
Theme: ${day.theme}.
Style: Clean, modern, engaging, 1200x628 ratio.
Content: ${day.facebook.post.substring(0, 100)}`;

      const fbVisualTemp = await generateSingleImage(openai, fbPrompt);
      
      if (fbVisualTemp) {
        const saved = await uploadImageToStorage(
          fbVisualTemp,
          `${userId}/${projectId}/day${day.day}/facebook.png`
        );
        day.facebook.visual = saved.url;
        day.facebook.visualKey = saved.key;
      }

      // Generate LinkedIn visual
      const liPrompt = `Professional LinkedIn infographic for ${context.industry}.
Theme: ${day.theme}.
Style: Corporate, data-driven, professional, informative.
Content: ${day.linkedin.post.substring(0, 100)}`;

      const liVisualTemp = await generateSingleImage(openai, liPrompt);
      
      if (liVisualTemp) {
        const saved = await uploadImageToStorage(
          liVisualTemp,
          `${userId}/${projectId}/day${day.day}/linkedin.png`
        );
        day.linkedin.visual = saved.url;
        day.linkedin.visualKey = saved.key;
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Failed to generate images for Day ${day.day}:`, error);
      // Continue even if image generation fails
    }
  }

  return updatedDays;
}

async function generateSingleImage(openai: OpenAI, prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard', // Use 'standard' to save costs, 'hd' for better quality
    style: 'vivid',
  });

  return response.data?.[0]?.url || '';
}

async function saveCampaignToDatabase(
  days: DayContent[],
  projectId: string,
  batchId: string,
  campaignStartDate: Date,
  timezone: string = 'Europe/Vilnius'
) {
  const savedItems = [];

  for (const day of days) {
    // Calculate scheduled date: startDate + day offset
    const scheduledDate = addDays(campaignStartDate, day.day);
    
    console.log(`📅 Day ${day.day} scheduled for: ${scheduledDate.toISOString()}`);
    
    // Instagram/Reels
    const instagramItem = await prisma.contentItem.create({
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
          scheduledDate: scheduledDate.toISOString(),
          timezone,
        },
        projectId,
        batchId,
      }
    });

    // Save as Asset in database
    if (day.instagram.reelsCover && day.instagram.reelsCoverKey) {
      await prisma.asset.create({
        data: {
          type: 'image',
          filename: `day${day.day}-instagram-reels.png`,
          path: day.instagram.reelsCoverKey, // R2 object key
          mimeType: 'image/png',
          projectId,
        }
      });
    }

    // Create schedule job for Instagram with VALIDATED date
    await prisma.scheduleJob.create({
      data: {
        scheduledFor: scheduledDate, // Use validated Date object
        platform: 'META',
        status: 'DRAFT',
        contentItemId: instagramItem.id,
        projectId,
        payload: {
          type: 'reel',
          caption: day.instagram.caption,
          mediaUrl: day.instagram.reelsCover,
        }
      }
    });

    // Facebook
    const facebookItem = await prisma.contentItem.create({
      data: {
        type: 'POST',
        title: `Day ${day.day} - Facebook - ${day.theme}`,
        content: {
          platform: 'facebook',
          post: day.facebook.post,
          cta: day.facebook.cta,
          image: day.facebook.visual, // PERMANENT R2 URL
          imageKey: day.facebook.visualKey,
        },
        metadata: { 
          day: day.day, 
          theme: day.theme,
          scheduledDate: scheduledDate.toISOString(),
          timezone,
        },
        projectId,
        batchId,
      }
    });

    // Save Facebook image as Asset
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

    await prisma.scheduleJob.create({
      data: {
        scheduledFor: scheduledDate, // Use validated Date object
        platform: 'META',
        status: 'DRAFT',
        contentItemId: facebookItem.id,
        projectId,
        payload: {
          type: 'post',
          text: day.facebook.post,
          mediaUrl: day.facebook.visual,
        }
      }
    });

    // LinkedIn
    const linkedinItem = await prisma.contentItem.create({
      data: {
        type: 'POST',
        title: `Day ${day.day} - LinkedIn - ${day.theme}`,
        content: {
          platform: 'linkedin',
          post: day.linkedin.post,
          angle: day.linkedin.angle,
          image: day.linkedin.visual, // PERMANENT R2 URL
          imageKey: day.linkedin.visualKey,
        },
        metadata: { 
          day: day.day, 
          theme: day.theme,
          scheduledDate: scheduledDate.toISOString(),
          timezone,
        },
        projectId,
        batchId,
      }
    });

    // Save LinkedIn image as Asset
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

    await prisma.scheduleJob.create({
      data: {
        scheduledFor: scheduledDate, // Use validated Date object
        platform: 'LINKEDIN',
        status: 'DRAFT',
        contentItemId: linkedinItem.id,
        projectId,
        payload: {
          type: 'post',
          text: day.linkedin.post,
          mediaUrl: day.linkedin.visual,
        }
      }
    });

    // TikTok (if available)
    if (day.tiktok) {
      const tiktokItem = await prisma.contentItem.create({
        data: {
          type: 'POST',
          title: `Day ${day.day} - TikTok - ${day.theme}`,
          content: {
            platform: 'tiktok',
            caption: day.tiktok.caption,
            hashtags: day.tiktok.hashtags,
          },
          metadata: { day: day.day, theme: day.theme },
          projectId,
          batchId,
        }
      });

      await prisma.scheduleJob.create({
        data: {
          scheduledFor: new Date(`${day.date} ${day.bestTime}`),
          platform: 'TIKTOK',
          status: 'DRAFT',
          contentItemId: tiktokItem.id,
          projectId,
          payload: {
            type: 'video',
            caption: day.tiktok.caption,
          }
        }
      });
    }

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
