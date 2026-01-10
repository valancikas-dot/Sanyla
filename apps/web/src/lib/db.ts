import { Pool } from 'pg';

// Lazy pool initialization
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    // Debug log
    console.log('DATABASE_URL exists:', !!connectionString);
    console.log('DATABASE_URL starts with:', connectionString?.substring(0, 30) + '...');
    
    if (!connectionString) {
      console.error('DATABASE_URL is not set! Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES')));
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

// User type
export interface User {
  id: string;
  email: string;
  password: string | null;
  name: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  token: string;
  organizationId: string;
  invitedBy: string | null;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  organization?: Organization;
}

// Generate CUID-like ID
function generateId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export const db = {
  // User operations
  user: {
    async findUnique(where: { email?: string; id?: string }): Promise<User | null> {
      const client = await getPool().connect();
      try {
        let result;
        if (where.email) {
          result = await client.query(
            'SELECT * FROM "User" WHERE email = $1',
            [where.email]
          );
        } else if (where.id) {
          result = await client.query(
            'SELECT * FROM "User" WHERE id = $1',
            [where.id]
          );
        }
        return result?.rows[0] || null;
      } finally {
        client.release();
      }
    },

    async create(data: { email: string; password?: string; name?: string; image?: string }): Promise<User> {
      const client = await getPool().connect();
      try {
        const id = generateId();
        const now = new Date();
        const result = await client.query(
          `INSERT INTO "User" (id, email, password, name, image, role, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           RETURNING *`,
          [id, data.email, data.password || null, data.name || null, data.image || null, 'user', now, now]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
  },

  // Organization operations
  organization: {
    async findUnique(where: { id: string }): Promise<Organization | null> {
      const client = await getPool().connect();
      try {
        const result = await client.query(
          'SELECT * FROM "Organization" WHERE id = $1',
          [where.id]
        );
        return result.rows[0] || null;
      } finally {
        client.release();
      }
    },

    async create(data: { name: string; slug: string }): Promise<Organization> {
      const client = await getPool().connect();
      try {
        const id = generateId();
        const now = new Date();
        const result = await client.query(
          `INSERT INTO "Organization" (id, name, slug, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING *`,
          [id, data.name, data.slug, now, now]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
  },

  // Membership operations
  membership: {
    async findFirst(where: { organizationId: string; userEmail?: string; role?: string }): Promise<Membership | null> {
      const client = await getPool().connect();
      try {
        let query = `
          SELECT m.* FROM "Membership" m
          JOIN "User" u ON m."userId" = u.id
          WHERE m."organizationId" = $1
        `;
        const params: any[] = [where.organizationId];
        
        if (where.userEmail) {
          query += ` AND u.email = $${params.length + 1}`;
          params.push(where.userEmail);
        }
        if (where.role) {
          query += ` AND m.role = $${params.length + 1}`;
          params.push(where.role);
        }
        query += ' LIMIT 1';
        
        const result = await client.query(query, params);
        return result.rows[0] || null;
      } finally {
        client.release();
      }
    },

    async create(data: { userId: string; organizationId: string; role: string }): Promise<Membership> {
      const client = await getPool().connect();
      try {
        const id = generateId();
        const now = new Date();
        const result = await client.query(
          `INSERT INTO "Membership" (id, "userId", "organizationId", role, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [id, data.userId, data.organizationId, data.role, now, now]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
  },

  // Team Invitation operations
  teamInvitation: {
    async findFirst(where: { email?: string; organizationId?: string; status?: string }): Promise<TeamInvitation | null> {
      const client = await getPool().connect();
      try {
        let query = 'SELECT * FROM "TeamInvitation" WHERE 1=1';
        const params: any[] = [];
        
        if (where.email) {
          params.push(where.email);
          query += ` AND email = $${params.length}`;
        }
        if (where.organizationId) {
          params.push(where.organizationId);
          query += ` AND "organizationId" = $${params.length}`;
        }
        if (where.status) {
          params.push(where.status);
          query += ` AND status = $${params.length}`;
        }
        query += ' LIMIT 1';
        
        const result = await client.query(query, params);
        return result.rows[0] || null;
      } finally {
        client.release();
      }
    },

    async findUnique(where: { token: string }): Promise<TeamInvitation | null> {
      const client = await getPool().connect();
      try {
        const result = await client.query(
          `SELECT ti.*, row_to_json(o.*) as organization 
           FROM "TeamInvitation" ti
           LEFT JOIN "Organization" o ON ti."organizationId" = o.id
           WHERE ti.token = $1`,
          [where.token]
        );
        if (result.rows[0]) {
          const row = result.rows[0];
          return {
            ...row,
            organization: row.organization
          };
        }
        return null;
      } finally {
        client.release();
      }
    },

    async create(data: { 
      email: string; 
      role: string; 
      token: string; 
      organizationId: string; 
      invitedBy?: string; 
      expiresAt: Date;
      status: string;
    }): Promise<TeamInvitation> {
      const client = await getPool().connect();
      try {
        const id = generateId();
        const now = new Date();
        const result = await client.query(
          `INSERT INTO "TeamInvitation" (id, email, role, token, "organizationId", "invitedBy", "expiresAt", status, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING *`,
          [id, data.email, data.role, data.token, data.organizationId, data.invitedBy || null, data.expiresAt, data.status, now, now]
        );
        
        // Get organization
        const org = await client.query('SELECT * FROM "Organization" WHERE id = $1', [data.organizationId]);
        return {
          ...result.rows[0],
          organization: org.rows[0]
        };
      } finally {
        client.release();
      }
    },

    async update(where: { id: string }, data: { status: string }): Promise<TeamInvitation> {
      const client = await getPool().connect();
      try {
        const result = await client.query(
          `UPDATE "TeamInvitation" SET status = $1, "updatedAt" = $2 WHERE id = $3 RETURNING *`,
          [data.status, new Date(), where.id]
        );
        return result.rows[0];
      } finally {
        client.release();
      }
    },
  },
};
