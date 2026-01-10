import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/team/accept?token=xxx - Accept team invitation
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Find invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation already used or expired' }, { status: 400 });
    }

    if (new Date() > invitation.expiresAt) {
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: 'expired' },
      });
      return NextResponse.json({ error: 'Invitation expired' }, { status: 400 });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    // If user doesn't exist, they need to sign up first
    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth?callbackUrl=/team/accept?token=${token}&email=${invitation.email}`
      );
    }

    // Create membership
    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    });

    // Mark invitation as accepted
    await prisma.teamInvitation.update({
      where: { id: invitation.id },
      data: { status: 'accepted' },
    });

    // Redirect to organization dashboard
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
  }
}
