import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/team/accept?token=xxx - Accept team invitation
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Find invitation
    const invitation = await db.teamInvitation.findUnique({ token });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation already used or expired' }, { status: 400 });
    }

    if (new Date() > invitation.expiresAt) {
      await db.teamInvitation.update({ id: invitation.id }, { status: 'expired' });
      return NextResponse.json({ error: 'Invitation expired' }, { status: 400 });
    }

    // Check if user exists
    const user = await db.user.findUnique({ email: invitation.email });

    // If user doesn't exist, they need to sign up first
    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth?callbackUrl=/team/accept?token=${token}&email=${invitation.email}`
      );
    }

    // Create membership
    await db.membership.create({
      userId: user.id,
      organizationId: invitation.organizationId,
      role: invitation.role,
    });

    // Mark invitation as accepted
    await db.teamInvitation.update({ id: invitation.id }, { status: 'accepted' });

    // Redirect to organization dashboard
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
  }
}
