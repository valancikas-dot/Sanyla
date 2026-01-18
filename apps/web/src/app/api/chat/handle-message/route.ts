/**
 * Chat → Campaign Bridge API Route
 * POST /api/chat/handle-message
 * 
 * Intelligently routes chat messages:
 * - Campaign intent → triggers /api/ai/campaign-auto
 * - Normal chat → passes to chat AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { detectIntent, getIntentName } from '@/lib/chat/intent-detection';
import prisma from '@/lib/prisma';

/**
 * Get absolute URL for server-side fetch
 */
function getAbsoluteUrl(path: string): string {
  const baseUrl = 
    process.env.NEXT_PUBLIC_APP_URL || 
    process.env.NEXTAUTH_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3000';
  
  return new URL(path, baseUrl).toString();
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('[ChatBridge] Unauthorized - no session');
      return NextResponse.json({ 
        type: 'error',
        errorType: 'UNAUTHORIZED',
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await req.json();
    const { 
      projectId, 
      message, 
      autoGenerateImages = true,
      language,
      // Scheduling parameters
      startAt,
      timezone = 'Europe/Vilnius'
    } = body;

    if (!projectId || !message) {
      console.log('[ChatBridge] Bad request - missing projectId or message');
      return NextResponse.json({
        type: 'error',
        errorType: 'BAD_REQUEST',
        error: 'Missing projectId or message' 
      }, { status: 400 });
    }

    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organization: {
          memberships: {
            some: {
              user: {
                email: session.user.email
              }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        language: true,
        industry: true,
        offer: true,
        targetAudience: true,
        tone: true,
        website: true,
      }
    });

    if (!project) {
      console.log('[ChatBridge] Project not found or access denied', { projectId, userEmail: session.user.email });
      return NextResponse.json({
        type: 'error',
        errorType: 'NOT_FOUND',
        error: 'Project not found or access denied' 
      }, { status: 404 });
    }

    // Detect intent
    const intent = detectIntent(message);
    const intentName = getIntentName(intent);
    
    console.log('[ChatBridge]', {
      projectId,
      intent: intentName,
      messagePreview: message.substring(0, 50) + '...'
    });

    // ==========================================
    // ROUTE 1: CAMPAIGN GENERATION
    // ==========================================
    if (intent === 'GENERATE_7_DAY_CAMPAIGN') {
      // If no startAt provided, ask user to schedule
      if (!startAt) {
        return NextResponse.json({
          type: 'needs_schedule',
          message: 'Planuokite kampanijos publikavimo laiką',
          projectId,
        });
      }

      try {
        // Call campaign-auto endpoint with scheduling
        const campaignResponse = await fetch(
          getAbsoluteUrl('/api/ai/campaign-auto'),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': req.headers.get('cookie') || '', // Forward session
            },
            body: JSON.stringify({
              projectId,
              prompt: message,
              autoGenerateImages,
              language: language || project.language || 'lt',
              startAt,
              timezone,
            }),
          }
        );

        const campaignData = await campaignResponse.json();

        // Handle campaign generation errors
        if (!campaignResponse.ok) {
          // Invalid date
          if (campaignResponse.status === 400) {
            return NextResponse.json({
              type: 'error',
              errorType: 'INVALID_DATE',
              message: campaignData.error || 'Neteisingas laikas. Pasirinkite teisingą datą ir laiką.',
            });
          }

          // Insufficient credits
          if (campaignResponse.status === 402) {
            return NextResponse.json({
              type: 'error',
              errorType: 'INSUFFICIENT_CREDITS',
              message: campaignData.error || 'Nepakanka AI kreditų. Reikia 30 kreditų 7 dienų kampanijai.',
              requiredCredits: 30,
              currentCredits: campaignData.currentCredits || 0,
            });
          }

          // Other errors
          return NextResponse.json({
            type: 'error',
            errorType: 'CAMPAIGN_GENERATION_FAILED',
            message: campaignData.error || 'Kampanijos generavimas nepavyko. Bandykite dar kartą.',
          });
        }

        // Success! Campaign generated
        const { batch, contentItems, summary } = campaignData;
        
        // Construct preview URL
        const previewUrl = `/dashboard/projects/${projectId}/content-calendar?batch=${batch.id}`;

        // Format start date for display
        const startDate = new Date(startAt);
        const formattedDate = startDate.toLocaleDateString('lt-LT', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return NextResponse.json({
          type: 'campaign_created',
          campaignId: batch.id,
          batchId: batch.id,
          projectId,
          previewUrl,
          summary: {
            days: 7,
            posts: summary?.totalPosts || contentItems?.length || 0,
            images: summary?.imagesGenerated || 0,
            platforms: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok'],
            startAt: formattedDate,
          },
          message: `✅ Sukurta 7 dienų kampanija su ${summary?.totalPosts || 0} įrašais ir ${summary?.imagesGenerated || 0} paveikslėliais!\n\n📅 Pradžia: ${formattedDate}`,
        });

      } catch (error: any) {
        console.error('[ChatBridge] Campaign generation error:', {
          error: error.message,
          stack: error.stack,
          projectId,
          hasStartAt: !!startAt,
        });
        
        return NextResponse.json({
          type: 'error',
          errorType: 'INTERNAL_ERROR',
          message: 'Serverio klaida. Bandykite dar kartą arba susisiekite su palaikymu.',
          error: error.message,
        }, { status: 500 });
      }
    }

    // ==========================================
    // ROUTE 2: NORMAL CHAT
    // ==========================================
    // Pass to existing chat AI endpoint
    try {
      const chatResponse = await fetch(
        getAbsoluteUrl('/api/ai/generate'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': req.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            projectId,
            type: 'text', // Default to text generation
            prompt: message,
            projectContext: {
              name: project.name,
              industry: project.industry,
              offer: project.offer,
              targetAudience: project.targetAudience,
              tone: project.tone,
              website: project.website,
              language: project.language,
            },
          }),
        }
      );

      const chatData = await chatResponse.json();

      if (!chatResponse.ok) {
        return NextResponse.json({
          type: 'error',
          errorType: 'CHAT_FAILED',
          message: chatData.error || 'Klaida bendraujant su AI. Bandykite dar kartą.',
        });
      }

      return NextResponse.json({
        type: 'chat_reply',
        message: chatData.content || 'AI atsakymas negautas.',
      });

    } catch (error: any) {
      console.error('[ChatBridge] Chat error:', {
        error: error.message,
        stack: error.stack,
        projectId,
      });
      
      return NextResponse.json({
        type: 'error',
        errorType: 'CHAT_ERROR',
        message: 'Klaida bendraujant su AI. Bandykite dar kartą.',
        error: error.message,
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[ChatBridge] Unexpected error:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    return NextResponse.json({
      type: 'error',
      errorType: 'UNEXPECTED_ERROR',
      message: 'Nenumatyta klaida. Bandykite dar kartą.',
      error: error.message,
    }, { status: 500 });
  }
}
