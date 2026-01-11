import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
  }

  try {
    const pool = getPool();

    // Get all social accounts for this project
    const result = await pool.query(
      `SELECT id, platform, account_name as "accountName", account_id as "accountId", 
              is_active as "isActive", created_at as "createdAt"
       FROM social_accounts 
       WHERE project_id = $1 
       ORDER BY created_at DESC`,
      [projectId]
    );

    return NextResponse.json({ accounts: result.rows });
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectId, platform, accountId, accountName, accessToken, refreshToken } = body;

    if (!projectId || !platform || !accountId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pool = getPool();

    // Deactivate any existing accounts for this platform/project
    await pool.query(
      `UPDATE social_accounts 
       SET is_active = false 
       WHERE project_id = $1 AND platform = $2`,
      [projectId, platform]
    );

    // Insert new account
    const result = await pool.query(
      `INSERT INTO social_accounts 
       (project_id, platform, account_id, account_name, access_token, refresh_token, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, true) 
       RETURNING id`,
      [projectId, platform, accountId, accountName, accessToken, refreshToken]
    );

    return NextResponse.json({ 
      success: true, 
      accountId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error saving social account:', error);
    return NextResponse.json({ error: 'Failed to save account' }, { status: 500 });
  }
}
