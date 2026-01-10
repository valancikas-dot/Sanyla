import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { db } from '@/lib/db';

// GET - get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const user = await db.user.findUnique({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Klaida gaunant profilį' }, { status: 500 });
  }
}

// PUT - update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // Get current user
    const user = await db.user.findUnique({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    // Update user
    const updatedUser = await db.userUpdate.update(
      { id: user.id },
      { name: name?.trim() }
    );

    return NextResponse.json({ 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
      }
    });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Klaida atnaujinant profilį' }, { status: 500 });
  }
}
