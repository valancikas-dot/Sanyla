import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/ai/campaign-approve
 * 
 * Approves a campaign batch and schedules all posts
 * Changes status from DRAFT to SCHEDULED
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { batchId, modifications } = await req.json();

    if (!batchId) {
      return NextResponse.json({ error: 'Missing batchId' }, { status: 400 });
    }

    // Get the batch with all content items
    const batch = await prisma.content_batches.findUnique({
      where: { id: batchId },
      include: {
        items: {
          include: {
            scheduleJobs: true
          }
        },
        project: true,
      }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    // Get default Instagram account for this project (auto-connect)
    const instagramAccount = await prisma.social_accounts.findFirst({
      where: {
        projectId: batch.projectId,
        platform: 'INSTAGRAM',
        status: 'ACTIVE',
      },
    });

    if (!instagramAccount) {
      return NextResponse.json({
        error: 'No Instagram account connected. Please connect your Instagram account first.',
        code: 'NO_INSTAGRAM_ACCOUNT',
      }, { status: 400 });
    }

    // Apply any modifications if provided
    if (modifications && Array.isArray(modifications)) {
      for (const mod of modifications) {
        if (mod.itemId && mod.updates) {
          await prisma.content_items.update({
            where: { id: mod.itemId },
            data: {
              content: mod.updates.content || undefined,
              metadata: mod.updates.metadata || undefined,
            }
          });
        }
      }
    }

    // Approve all schedule jobs (change from DRAFT to SCHEDULED + link social account)
    const scheduleJobIds = batch.items.flatMap(item => 
      item.scheduleJobs.map(job => job.id)
    );

    await prisma.schedule_jobs.updateMany({
      where: {
        id: { in: scheduleJobIds }
      },
      data: {
        status: 'SCHEDULED',
        socialAccountId: instagramAccount.id, // Link to Instagram account
      }
    });

    // Count approved jobs
    const approvedCount = await prisma.schedule_jobs.count({
      where: {
        id: { in: scheduleJobIds },
        status: 'SCHEDULED'
      }
    });

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      approvedPosts: approvedCount,
      message: `${approvedCount} posts scheduled successfully!`,
    });

  } catch (error: any) {
    console.error('Campaign approve error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to approve campaign',
    }, { status: 500 });
  }
}

/**
 * DELETE /api/ai/campaign-approve
 * 
 * Rejects and deletes an entire campaign batch
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json({ error: 'Missing batchId' }, { status: 400 });
    }

    // Delete the batch (cascade will delete items and schedule jobs)
    await prisma.content_batches.delete({
      where: { id: batchId }
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign batch deleted successfully',
    });

  } catch (error: any) {
    console.error('Campaign delete error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to delete campaign',
    }, { status: 500 });
  }
}
