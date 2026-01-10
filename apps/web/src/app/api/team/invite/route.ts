import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// POST /api/team/invite - Invite team member
export async function POST(req: NextRequest) {
  try {
    // TODO: Add auth check when auth is properly set up
    // For now, require userId to be passed in request
    const { email, organizationId, role = 'member', currentUserEmail } = await req.json();

    if (!email || !organizationId || !currentUserEmail) {
      return NextResponse.json({ error: 'Email, organizationId, and currentUserEmail required' }, { status: 400 });
    }

    // Check if user is owner of organization
    const membership = await prisma.membership.findFirst({
      where: {
        organizationId,
        user: { email: currentUserEmail },
        role: 'owner',
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Only organization owners can invite members' }, { status: 403 });
    }

    // Check if user already exists in organization
    const existingMember = await prisma.membership.findFirst({
      where: {
        organizationId,
        user: { email },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User already a member of this organization' }, { status: 400 });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.teamInvitation.findFirst({
      where: {
        email,
        organizationId,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail },
    });

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await prisma.teamInvitation.create({
      data: {
        email,
        role,
        token,
        organizationId,
        invitedBy: currentUser?.id,
        expiresAt,
        status: 'pending',
      },
      include: {
        organization: true,
      },
    });

    // TODO: Send email with invitation link
    // const inviteUrl = `${process.env.NEXTAUTH_URL}/team/accept?token=${token}`;

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        organizationName: invitation.organization.name,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Team invite error:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}

// GET /api/team/invite - List pending invitations for organization
export async function GET(req: NextRequest) {
  try {
    // TODO: Add auth check when auth is properly set up
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId required' }, { status: 400 });
    }

    // TODO: Check if user is member of organization

    const invitations = await prisma.teamInvitation.findMany({
      where: {
        organizationId,
        status: 'pending',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}
