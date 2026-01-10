import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// POST /api/team/invite - Invite team member
export async function POST(req: NextRequest) {
  try {
    const { email, organizationId, role = 'member', currentUserEmail } = await req.json();

    if (!email || !organizationId || !currentUserEmail) {
      return NextResponse.json({ error: 'Email, organizationId, and currentUserEmail required' }, { status: 400 });
    }

    // Check if user is owner of organization
    const membership = await db.membership.findFirst({
      organizationId,
      userEmail: currentUserEmail,
      role: 'owner',
    });

    if (!membership) {
      return NextResponse.json({ error: 'Only organization owners can invite members' }, { status: 403 });
    }

    // Check if user already exists in organization
    const existingMember = await db.membership.findFirst({
      organizationId,
      userEmail: email,
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User already a member of this organization' }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvitation = await db.teamInvitation.findFirst({
      email,
      organizationId,
      status: 'pending',
    });

    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
    }

    // Get current user
    const currentUser = await db.user.findUnique({ email: currentUserEmail });

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await db.teamInvitation.create({
      email,
      role,
      token,
      organizationId,
      invitedBy: currentUser?.id,
      expiresAt,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        organizationName: invitation.organization?.name,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}

// GET /api/team/invite - List pending invitations (simplified - returns error for now)
export async function GET(req: NextRequest) {
  // This endpoint requires more complex query - returning not implemented for now
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
