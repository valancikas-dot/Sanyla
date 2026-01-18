/**
 * Admin Access Check API
 * GET /api/admin/check-access
 * 
 * Returns whether current user is an admin
 * Safe for client-side calls
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin/isAdmin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ isAdmin: false });
    }

    const admin = isAdminEmail(session.user.email);
    
    return NextResponse.json({ isAdmin: admin });
  } catch (error) {
    console.error('[Admin Check] Error:', error);
    // On error, default to not admin (safe default)
    return NextResponse.json({ isAdmin: false });
  }
}
