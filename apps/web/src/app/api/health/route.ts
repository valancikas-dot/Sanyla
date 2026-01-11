import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    services: {} as Record<string, any>,
  };

  // Check database
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW() as now, COUNT(*) as user_count FROM users');
    checks.services.database = {
      status: 'ok',
      userCount: parseInt(result.rows[0].user_count),
      timestamp: result.rows[0].now,
    };
  } catch (error: any) {
    checks.status = 'degraded';
    checks.services.database = {
      status: 'error',
      error: error.message,
    };
  }

  // Check OpenAI
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  checks.services.openai = {
    status: hasOpenAI ? 'configured' : 'not_configured',
    enabled: hasOpenAI,
  };

  // Check social OAuth
  checks.services.oauth = {
    facebook: {
      configured: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
    },
    linkedin: {
      configured: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    },
  };

  // Check cron
  checks.services.cron = {
    configured: !!process.env.CRON_SECRET,
  };

  // Calculate overall status
  const allConfigured = 
    checks.services.database.status === 'ok' &&
    checks.services.openai.enabled &&
    checks.services.oauth.facebook.configured &&
    checks.services.oauth.linkedin.configured &&
    checks.services.cron.configured;

  checks.status = allConfigured ? 'healthy' : (checks.services.database.status === 'ok' ? 'partial' : 'unhealthy');

  const statusCode = checks.status === 'healthy' ? 200 : (checks.status === 'partial' ? 200 : 503);

  return NextResponse.json(checks, { status: statusCode });
}
