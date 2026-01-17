/**
 * Admin Metrics API
 * GET /api/admin/metrics
 * 
 * Protected endpoint - requires admin email allowlist
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/isAdmin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Check admin access
    await requireAdmin();

    // 2. Compute metrics in parallel
    const now = new Date();
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      // A) USERS
      totalUsers,
      newUsers7d,
      activeUsers7d,

      // B) CAMPAIGNS
      campaigns7d,
      campaigns30d,

      // C) POSTING HEALTH
      scheduled7d,
      posted7d,
      failed7d,
      failureReasons,

      // D) REVENUE SIGNALS
      purchases30d,
      creditsSold30d,
      rewrites30d,

      // E) PERFORMANCE
      avgEngagementData,
      underperformingCount,
    ] = await Promise.all([
      // A) USERS
      prisma.user.count(),
      
      prisma.user.count({
        where: { createdAt: { gte: last7d } },
      }),
      
      prisma.user.count({
        where: {
          campaigns: {
            some: {
              createdAt: { gte: last7d },
            },
          },
        },
      }),

      // B) CAMPAIGNS
      prisma.campaign.count({
        where: { createdAt: { gte: last7d } },
      }),
      
      prisma.campaign.count({
        where: { createdAt: { gte: last30d } },
      }),

      // C) POSTING HEALTH
      prisma.scheduleJob.count({
        where: {
          status: 'SCHEDULED',
          createdAt: { gte: last7d },
        },
      }),
      
      prisma.scheduleJob.count({
        where: {
          status: 'POSTED',
          publishedAt: { gte: last7d },
        },
      }),
      
      prisma.scheduleJob.count({
        where: {
          status: 'FAILED',
          updatedAt: { gte: last7d },
        },
      }),
      
      // Top 10 failure reasons (last 30d)
      prisma.scheduleJob.groupBy({
        by: ['error'],
        where: {
          status: 'FAILED',
          updatedAt: { gte: last30d },
        },
        _count: {
          error: true,
        },
        orderBy: {
          _count: {
            error: 'desc',
          },
        },
        take: 10,
      }),

      // D) REVENUE SIGNALS
      prisma.creditLog.count({
        where: {
          action: 'CREDITS_PURCHASE',
          createdAt: { gte: last30d },
        },
      }),
      
      // Sum of revenue (cost is in AI credits, we need to map to EUR)
      // Since CreditLog has 'cost' field, we'll aggregate on that
      prisma.creditLog.aggregate({
        where: {
          action: 'CREDITS_PURCHASE',
          createdAt: { gte: last30d },
        },
        _sum: {
          cost: true,
        },
      }),
      
      prisma.creditLog.count({
        where: {
          action: 'POST_REWRITE',
          createdAt: { gte: last30d },
        },
      }),

      // E) PERFORMANCE
      // Average engagement rate (last 7d)
      prisma.socialMetric.aggregate({
        where: {
          collectedAt: { gte: last7d },
        },
        _avg: {
          engagementRate: true,
        },
      }),
      
      // Underperforming posts (collected in last 48h with engagement < 1%)
      prisma.socialMetric.count({
        where: {
          collectedAt: { gte: last48h },
          engagementRate: { lt: 0.01 },
        },
      }),
    ]);

    // 3. Format metrics
    const metrics = {
      timestamp: now.toISOString(),
      
      users: {
        total: totalUsers,
        new7d: newUsers7d,
        active7d: activeUsers7d,
      },
      
      campaigns: {
        last7d: campaigns7d,
        last30d: campaigns30d,
      },
      
      posting: {
        scheduled7d,
        posted7d,
        failed7d,
        successRate7d: posted7d + failed7d > 0 
          ? ((posted7d / (posted7d + failed7d)) * 100).toFixed(1) + '%'
          : 'N/A',
        topFailures30d: failureReasons.map(f => ({
          error: f.error || '(empty)',
          count: f._count.error,
        })),
      },
      
      revenue: {
        purchases30d,
        creditsSold30d: creditsSold30d._sum?.cost || 0,
        // Note: creditsSold30d is AI credits, not EUR
        // To get actual revenue, we'd need to track purchase amounts separately
        // For now, showing total credits purchased
        rewrites30d,
      },
      
      performance: {
        avgEngagementRate7d: avgEngagementData._avg?.engagementRate 
          ? (avgEngagementData._avg.engagementRate * 100).toFixed(2) + '%'
          : 'N/A',
        underperformingPosts48h: underperformingCount,
      },
    };

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    
    // Check if it's an auth error
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch admin metrics' },
      { status: 500 }
    );
  }
}
