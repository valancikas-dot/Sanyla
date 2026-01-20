import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

// Lazy OpenAI initialization
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Credit cost for post rewrite
const REWRITE_CREDIT_COST = 5;

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAI();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleJobId } = body;

    if (!scheduleJobId) {
      return NextResponse.json(
        { error: 'scheduleJobId is required' },
        { status: 400 }
      );
    }

    // 1. Find ScheduleJob with metrics and contentItem
    const scheduleJob = await prisma.schedule_jobs.findUnique({
      where: { id: scheduleJobId },
      include: {
        contentItem: true,
        metrics: {
          orderBy: { collectedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!scheduleJob) {
      return NextResponse.json(
        { error: 'Schedule job not found' },
        { status: 404 }
      );
    }

    // 2. Check if metrics exist
    if (!scheduleJob.metrics || scheduleJob.metrics.length === 0) {
      return NextResponse.json(
        { error: 'No metrics available yet. Metrics are collected every 6 hours after posting.' },
        { status: 400 }
      );
    }

    const latestMetric = scheduleJob.metrics[0];
    const engagementRate = latestMetric.engagementRate || 0;

    // 3. Performance classification (DETERMINISTIC RULE)
    const THRESHOLD = 0.01; // 1%
    if (engagementRate >= THRESHOLD) {
      return NextResponse.json({
        status: 'SKIPPED',
        message: 'Post performance is OK, no optimization needed',
        engagementRate,
        threshold: THRESHOLD,
      });
    }

    // 4. Get user and check credits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true,
        aiCredits: true,
        email: true,
      },
    });

    if (!user || user.aiCredits < REWRITE_CREDIT_COST) {
      return NextResponse.json(
        {
          error: 'INSUFFICIENT_CREDITS',
          message: `You need ${REWRITE_CREDIT_COST} credits to rewrite a post. Current balance: ${user?.aiCredits || 0}`,
          required: REWRITE_CREDIT_COST,
          current: user?.aiCredits || 0,
        },
        { status: 402 }
      );
    }

    const userId = user.id;

    // 5. Get original caption from contentItem
    const contentItem = scheduleJob.contentItem;
    if (!contentItem || !contentItem.content) {
      return NextResponse.json(
        { error: 'Content item not found or has no content' },
        { status: 404 }
      );
    }

    // Extract caption from content JSON
    const content = contentItem.content as any;
    const originalCaption = content.caption || content.text || '';

    if (!originalCaption) {
      return NextResponse.json(
        { error: 'No caption found in content item' },
        { status: 400 }
      );
    }

    // 6. Call OpenAI to rewrite hook + CTA ONLY
    const systemPrompt = `You are an Instagram optimization expert.
Your task: Rewrite ONLY the hook (opening 1-2 sentences) and CTA (call-to-action at the end).
Keep the middle content EXACTLY as it is.

RULES:
- Hook: Make it attention-grabbing, curiosity-driven, or problem-focused
- CTA: Make it clear, actionable, and engagement-focused (e.g., "Save this for later", "Share with someone who needs this")
- Do NOT change the middle content
- Keep the same language as the original
- Return JSON: { "hook": "...", "cta": "..." }`;

    const userPrompt = `Original caption (engagement rate: ${(engagementRate * 100).toFixed(2)}%):

${originalCaption}

Rewrite ONLY the hook and CTA to improve engagement.`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8, // Higher creativity for rewriting
      response_format: { type: 'json_object' },
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(aiContent);
    if (!parsed.hook || !parsed.cta) {
      return NextResponse.json(
        { error: 'Invalid AI response format: missing hook or cta' },
        { status: 500 }
      );
    }

    const { hook: newHook, cta: newCTA } = parsed;

    // 7. Deduct credits and create audit log (ATOMIC TRANSACTION)
    await prisma.$transaction(async (tx) => {
      // Deduct credits
      await tx.user.update({
        where: { id: userId },
        data: { aiCredits: { decrement: REWRITE_CREDIT_COST } },
      });

      // Create credit log
      await tx.creditLog.create({
        data: {
          userId: userId,
          action: 'POST_REWRITE',
          cost: REWRITE_CREDIT_COST,
          metadata: {
            scheduleJobId,
            originalEngagementRate: engagementRate,
          },
        },
      });
    });

    // 8. Create optimized ContentItem (DRAFT)
    const originalTitle = contentItem.title || 'Post';
    const optimizedContentItem = await prisma.content_items.create({
      data: {
        type: 'POST',
        title: `${originalTitle} (Optimized)`,
        content: {
          ...content,
          caption: content.caption, // Keep original for reference
          optimized: {
            hook: newHook,
            cta: newCTA,
            originalEngagementRate: engagementRate,
            optimizedAt: new Date().toISOString(),
          },
        },
        metadata: {
          originalContentItemId: contentItem.id,
          originalScheduleJobId: scheduleJobId,
          optimizationReason: 'UNDERPERFORMING',
          engagementRate,
          threshold: THRESHOLD,
        },
        projectId: contentItem.projectId,
      },
    });

    return NextResponse.json({
      success: true,
      newHook,
      newCTA,
      engagementRate,
      threshold: THRESHOLD,
      creditsUsed: REWRITE_CREDIT_COST,
      optimizedContentItemId: optimizedContentItem.id,
      message: 'Post optimized successfully. New content saved as DRAFT.',
    });
  } catch (error) {
    console.error('Rewrite post error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to rewrite post', details: errorMessage },
      { status: 500 }
    );
  }
}
