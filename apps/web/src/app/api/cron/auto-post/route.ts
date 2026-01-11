import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/cron/auto-post - Automatically post approved content at scheduled time
// This endpoint should be called by a cron job every hour or Railway's cron
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-cron-secret-change-me';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    // Find approved content that should be posted now
    const result = await pool.query(`
      SELECT cc.*, sa.* 
      FROM content_calendar cc
      LEFT JOIN social_accounts sa ON cc."projectId" = sa."projectId" 
        AND cc.platform = sa.platform
      WHERE cc.status = 'approved'
        AND cc."scheduledDate" = $1
        AND cc."postingTime" <= $2
        AND sa."isActive" = true
      ORDER BY cc."postingTime" ASC
      LIMIT 50
    `, [currentDate, currentTime]);

    const posted = [];
    const failed = [];

    for (const item of result.rows) {
      try {
        // Call posting API
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/social-posting/post`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cronSecret}` 
          },
          body: JSON.stringify({ contentId: item.id }),
        });

        if (response.ok) {
          posted.push(item.id);
        } else {
          failed.push({ id: item.id, error: await response.text() });
        }
      } catch (error: any) {
        failed.push({ id: item.id, error: error.message });
      }
    }

    return NextResponse.json({ 
      success: true,
      checked: result.rows.length,
      posted: posted.length,
      failed: failed.length,
      postedIds: posted,
      errors: failed,
      timestamp: now.toISOString()
    });

  } catch (error: any) {
    console.error('Auto-post cron error:', error);
    return NextResponse.json({ 
      error: error.message || 'Auto-post failed'
    }, { status: 500 });
  }
}
