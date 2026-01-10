import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Pool } from 'pg';
import crypto from 'crypto';

function getPool() {
  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

// POST /api/team/invite - Invite team member
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const { email, role = 'member' } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'El. paštas privalomas' }, { status: 400 });
    }

    // Get current user
    const currentUser = await db.user.findUnique({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    // Get user's organization where they are owner
    const pool = getPool();
    const conn = await pool.connect();
    
    try {
      const membershipResult = await conn.query(
        'SELECT "organizationId" FROM "memberships" WHERE "userId" = $1 AND role = $2 LIMIT 1',
        [currentUser.id, 'owner']
      );
      
      if (!membershipResult.rows[0]) {
        return NextResponse.json({ error: 'Tik savininkas gali kviesti narius' }, { status: 403 });
      }

      const organizationId = membershipResult.rows[0].organizationId;

      // Check if user already a member
      const existingMemberResult = await conn.query(
        `SELECT m.id FROM "memberships" m 
         JOIN "users" u ON m."userId" = u.id 
         WHERE m."organizationId" = $1 AND u.email = $2`,
        [organizationId, email]
      );

      if (existingMemberResult.rows[0]) {
        return NextResponse.json({ error: 'Vartotojas jau yra komandos narys' }, { status: 400 });
      }

      // Check if invitation already exists
      const existingInvitation = await db.teamInvitation.findFirst({
        email,
        organizationId,
        status: 'pending',
      });

      if (existingInvitation) {
        return NextResponse.json({ error: 'Pakvietimas jau išsiųstas šiam el. paštui' }, { status: 400 });
      }

      // Create invitation
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      const invitation = await db.teamInvitation.create({
        email,
        role,
        token,
        organizationId,
        invitedBy: currentUser.id,
        expiresAt,
        status: 'pending',
      });

      // TODO: Send email with invitation link
      console.log('Invitation created:', invitation.id, 'Token:', token);

      return NextResponse.json({ 
        success: true,
        message: 'Pakvietimas sukurtas',
        inviteLink: `${process.env.NEXTAUTH_URL}/api/team/accept?token=${token}`
      });
    } finally {
      conn.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json({ error: 'Klaida siunčiant pakvietimą' }, { status: 500 });
  }
}
