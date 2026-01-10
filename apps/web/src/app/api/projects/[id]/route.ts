import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Pool } from 'pg';

function getPool() {
  return new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

// GET - fetch single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const project = await db.project.findUnique({ id: params.id });
    
    if (!project) {
      return NextResponse.json({ error: 'Projektas nerastas' }, { status: 404 });
    }

    // Verify user has access to this project's organization
    const user = await db.user.findUnique({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    const pool = getPool();
    const conn = await pool.connect();
    
    try {
      const membershipResult = await conn.query(
        'SELECT "organizationId" FROM "memberships" WHERE "userId" = $1 AND "organizationId" = $2 LIMIT 1',
        [user.id, project.organizationId]
      );
      
      if (!membershipResult.rows[0]) {
        return NextResponse.json({ error: 'Neturite prieigos' }, { status: 403 });
      }

      return NextResponse.json({ project });
    } finally {
      conn.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json({ error: 'Klaida gaunant projektą' }, { status: 500 });
  }
}

// PUT - update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const body = await request.json();
    
    // Get existing project
    const existingProject = await db.project.findUnique({ id: params.id });
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Projektas nerastas' }, { status: 404 });
    }

    // Verify user has access
    const user = await db.user.findUnique({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    const pool = getPool();
    const conn = await pool.connect();
    
    try {
      const membershipResult = await conn.query(
        'SELECT "organizationId" FROM "memberships" WHERE "userId" = $1 AND "organizationId" = $2 LIMIT 1',
        [user.id, existingProject.organizationId]
      );
      
      if (!membershipResult.rows[0]) {
        return NextResponse.json({ error: 'Neturite prieigos' }, { status: 403 });
      }

      // Update project
      const { name, industry, country, city, website, offer, targetAudience, language, tone } = body;
      
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (industry !== undefined) {
        updateFields.push(`industry = $${paramIndex++}`);
        values.push(industry);
      }
      if (country !== undefined) {
        updateFields.push(`country = $${paramIndex++}`);
        values.push(country);
      }
      if (city !== undefined) {
        updateFields.push(`city = $${paramIndex++}`);
        values.push(city);
      }
      if (website !== undefined) {
        updateFields.push(`website = $${paramIndex++}`);
        values.push(website);
      }
      if (offer !== undefined) {
        updateFields.push(`offer = $${paramIndex++}`);
        values.push(offer);
      }
      if (targetAudience !== undefined) {
        updateFields.push(`"targetAudience" = $${paramIndex++}`);
        values.push(targetAudience);
      }
      if (language !== undefined) {
        updateFields.push(`language = $${paramIndex++}`);
        values.push(language);
      }
      if (tone !== undefined) {
        updateFields.push(`tone = $${paramIndex++}`);
        values.push(tone);
      }

      updateFields.push(`"updatedAt" = $${paramIndex++}`);
      values.push(new Date());
      values.push(params.id);

      const result = await conn.query(
        `UPDATE "projects" SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      return NextResponse.json({ project: result.rows[0] });
    } finally {
      conn.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Project PUT error:', error);
    return NextResponse.json({ error: 'Klaida atnaujinant projektą' }, { status: 500 });
  }
}

// DELETE - delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Neprisijungęs' }, { status: 401 });
    }

    const existingProject = await db.project.findUnique({ id: params.id });
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Projektas nerastas' }, { status: 404 });
    }

    const user = await db.user.findUnique({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    const pool = getPool();
    const conn = await pool.connect();
    
    try {
      const membershipResult = await conn.query(
        'SELECT role FROM "memberships" WHERE "userId" = $1 AND "organizationId" = $2 LIMIT 1',
        [user.id, existingProject.organizationId]
      );
      
      if (!membershipResult.rows[0] || membershipResult.rows[0].role !== 'owner') {
        return NextResponse.json({ error: 'Tik savininkas gali ištrinti projektą' }, { status: 403 });
      }

      await db.project.delete({ id: params.id });

      return NextResponse.json({ success: true });
    } finally {
      conn.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ error: 'Klaida trinant projektą' }, { status: 500 });
  }
}
