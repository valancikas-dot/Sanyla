import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPool } from '@/lib/db';

// PATCH /api/content-calendar/[id] - Update content status (approve/reject)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, approvalNotes, caption, hashtags } = await req.json();
    const contentId = params.id;

    const pool = getPool();

    // Get user ID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Update content
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (status) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (approvalNotes !== undefined) {
      updateFields.push(`"approvalNotes" = $${paramIndex++}`);
      values.push(approvalNotes);
    }

    if (caption !== undefined) {
      updateFields.push(`caption = $${paramIndex++}`);
      values.push(caption);
    }

    if (hashtags !== undefined) {
      updateFields.push(`hashtags = $${paramIndex++}`);
      values.push(hashtags);
    }

    updateFields.push(`"updatedAt" = NOW()`);

    if (status === 'approved') {
      updateFields.push(`"approvedAt" = NOW()`);
      updateFields.push(`"approvedBy" = $${paramIndex++}`);
      values.push(userId);
    }

    values.push(contentId);

    const query = `
      UPDATE content_calendar 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      content: result.rows[0]
    });

  } catch (error: any) {
    console.error('Update content error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update content'
    }, { status: 500 });
  }
}

// DELETE /api/content-calendar/[id] - Delete content item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();
    
    await pool.query('DELETE FROM content_calendar WHERE id = $1', [params.id]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete content error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete content'
    }, { status: 500 });
  }
}
