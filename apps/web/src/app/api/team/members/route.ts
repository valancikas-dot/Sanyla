import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';

interface MemberRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  created_at: Date;
}

interface InvitationRow {
  id: string;
  email: string;
  role: string;
  created_at: Date;
  expires_at: Date;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('[TeamMembers] Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();

    // Get current user
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    );
    
    if (userResult.rows.length === 0) {
      console.log('[TeamMembers] User not found in database', { email: session.user.email });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = userResult.rows[0].id;

    // Get user's organization
    const membershipResult = await pool.query(
      'SELECT organization_id FROM memberships WHERE user_id = $1',
      [userId]
    );
    
    if (membershipResult.rows.length === 0) {
      console.log('[TeamMembers] No organization membership found', { userId });
      return NextResponse.json({ members: [], invitations: [] });
    }
    
    const organizationId = membershipResult.rows[0].organization_id;

    // Get all members of this organization
    const membersResult = await pool.query<MemberRow>(
      `SELECT u.id, u.name, u.email, u.image, m.role, m.created_at
       FROM users u
       JOIN memberships m ON u.id = m.user_id
       WHERE m.organization_id = $1
       ORDER BY m.created_at ASC`,
      [organizationId]
    );

    // Get pending invitations
    const invitationsResult = await pool.query<InvitationRow>(
      `SELECT id, email, role, created_at, expires_at
       FROM team_invitations
       WHERE organization_id = $1 AND accepted = false AND expires_at > NOW()
       ORDER BY created_at DESC`,
      [organizationId]
    );

    return NextResponse.json({
      members: membersResult.rows.map((m: MemberRow) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        image: m.image,
        role: m.role,
        joinedAt: m.created_at
      })),
      invitations: invitationsResult.rows.map((i: InvitationRow) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        sentAt: i.created_at,
        expiresAt: i.expires_at
      }))
    });
  } catch (error) {
    console.error('[TeamMembers] Error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
