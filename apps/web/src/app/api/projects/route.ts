import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { Pool } from 'pg';

// Create a reusable pool getter
function getPool() {
  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

// GET - fetch all projects for user's organization
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    // Get user
    const user = await db.user.findUnique({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    const pool = getPool();
    const conn = await pool.connect();
    
    try {
      const membershipResult = await conn.query(
        'SELECT "organizationId" FROM "memberships" WHERE "userId" = $1 LIMIT 1',
        [user.id]
      );
      
      if (!membershipResult.rows[0]) {
        return NextResponse.json({ projects: [] });
      }

      const orgId = membershipResult.rows[0].organizationId;
      const projects = await db.project.findMany({ organizationId: orgId });
      
      return NextResponse.json({ projects });
    } finally {
      conn.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Klaida gaunant projektus' }, { status: 500 });
  }
}

// POST - create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const body = await request.json();
    const { name, industry } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Projekto pavadinimas privalomas' }, { status: 400 });
    }

    // Get user
    const user = await db.user.findUnique({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    const pool = getPool();
    const conn = await pool.connect();
    
    try {
      const membershipResult = await conn.query(
        'SELECT "organizationId" FROM "memberships" WHERE "userId" = $1 LIMIT 1',
        [user.id]
      );
      
      if (!membershipResult.rows[0]) {
        return NextResponse.json({ error: 'Neturite organizacijos' }, { status: 400 });
      }

      const orgId = membershipResult.rows[0].organizationId;
      
      const project = await db.project.create({
        name: name.trim(),
        industry: industry?.trim() || undefined,
        organizationId: orgId,
      });
      
      return NextResponse.json({ project }, { status: 201 });
    } finally {
      conn.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Klaida kuriant projektą' }, { status: 500 });
  }
}
