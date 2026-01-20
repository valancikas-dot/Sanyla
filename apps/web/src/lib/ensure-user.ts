/**
 * Ensure user exists in database
 * Called when user first accesses dashboard after Google OAuth
 */
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';

export async function ensureUserExists(session: Session | null): Promise<void> {
  if (!session?.user?.email) {
    return;
  }

  try {
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { email: session.user.email },
    });

    if (!existingUser) {
      // Create user from session data
      await prisma.users.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
          image: session.user.image || undefined,
        },
      });
      
      console.log('[EnsureUser] Created user:', session.user.email);
    }
  } catch (error) {
    // Log but don't throw - user can still access the app
    console.error('[EnsureUser] Failed to create user:', error);
  }
}
