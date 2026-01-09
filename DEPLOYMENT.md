# 🚀 Deployment Guide

This guide covers deploying AI Marketing Autopilot to production.

---

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)
Full-stack deployment in 5 minutes.

### Option 2: Vercel + Railway
Frontend on Vercel, Backend on Railway.

### Option 3: Self-Hosted (VPS)
Maximum control, requires more setup.

---

## Option 1: Railway (Full-Stack)

Railway auto-detects monorepos and can deploy both apps.

### 1. Prerequisites
- Railway account: https://railway.app
- GitHub repository

### 2. Deploy Backend

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy API
cd apps/api
railway up
```

### 3. Configure Environment Variables

In Railway dashboard:

```bash
DATABASE_URL=postgresql://...  # From Railway PostgreSQL addon
REDIS_URL=redis://...          # From Railway Redis addon
JWT_SECRET=your-production-secret-change-this
NEXTAUTH_SECRET=your-nextauth-secret-change-this
OPENAI_API_KEY=sk-proj-...
ENCRYPTION_KEY=your-base64-key-from-openssl
API_PORT=4000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 4. Add Services

In Railway dashboard:
- Add PostgreSQL database
- Add Redis
- Note connection strings

### 5. Deploy Frontend

```bash
cd apps/web
railway up
```

Environment variables:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app
NEXTAUTH_URL=https://your-frontend-domain.railway.app
NEXTAUTH_SECRET=same-as-backend
```

### 6. Run Migrations

```bash
railway run pnpm prisma migrate deploy
railway run pnpm db:seed
```

### 7. Set Custom Domains (Optional)

In Railway → Settings → Domains → Add custom domain

**Total time:** ~10-15 minutes

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### A. Deploy Backend to Railway

Follow steps 2-4 from Option 1.

### B. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod
```

### C. Configure Vercel Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=same-as-backend
```

### D. Redeploy

```bash
vercel --prod
```

**Benefits:**
- Vercel's edge network for frontend
- Railway's powerful backend hosting
- Best performance globally

**Total time:** ~15-20 minutes

---

## Option 3: Self-Hosted VPS (DigitalOcean/AWS/Hetzner)

### Prerequisites
- VPS with Ubuntu 22.04+ (2GB+ RAM recommended)
- Domain name
- SSL certificate (Let's Encrypt)

### 1. Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Redis
apt install -y redis-server

# Install Nginx
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx

# Install PM2 (process manager)
npm install -g pm2
```

### 2. Database Setup

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE marketing_autopilot;
CREATE USER autopilot WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE marketing_autopilot TO autopilot;
\q
```

### 3. Clone & Build

```bash
# Create app user
adduser --disabled-password --gecos "" autopilot
su - autopilot

# Clone repo
git clone https://github.com/yourusername/sanyla.git
cd sanyla

# Install dependencies
pnpm install

# Build
pnpm build

# Setup .env
cp .env.template .env
nano .env  # Edit with production values
```

### 4. Run Migrations

```bash
cd prisma
pnpm prisma migrate deploy
pnpm seed
```

### 5. Start with PM2

```bash
# Start backend
cd apps/api
pm2 start dist/main.js --name api-prod

# Start frontend
cd apps/web
pm2 start npm --name web-prod -- start

# Save PM2 config
pm2 save
pm2 startup  # Follow instructions
```

### 6. Nginx Configuration

```bash
# Create config
sudo nano /etc/nginx/sites-available/autopilot

# Add:
```

```nginx
# API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/autopilot /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. SSL Certificate

```bash
# Get SSL cert
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 8. Firewall

```bash
# Configure UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

**Total time:** ~45-60 minutes

---

## Environment Variables (Production)

### Required

```bash
# Database (Neon/Railway PostgreSQL)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Redis (Upstash/Railway Redis)
REDIS_URL="redis://default:password@host:6379"

# OpenAI
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxx"

# Auth (CHANGE THESE!)
JWT_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Encryption (from local .env)
ENCRYPTION_KEY="your-32-byte-base64-key"

# URLs
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"
```

### Generate Secrets

```bash
# JWT Secret
openssl rand -base64 32

# NextAuth Secret
openssl rand -base64 32

# If you need new encryption key (will invalidate existing encrypted data!)
openssl rand -base64 32
```

---

## Cloud Database Setup

### Neon PostgreSQL (Recommended)

1. Sign up: https://neon.tech
2. Create project
3. Copy connection string
4. Add to `DATABASE_URL`

**Benefits:**
- Free tier: 0.5 GB storage
- Auto-scaling
- Branching for dev/staging
- Fast cold starts

### Upstash Redis (Recommended)

1. Sign up: https://upstash.com
2. Create Redis database
3. Copy connection URL
4. Add to `REDIS_URL`

**Benefits:**
- Free tier: 10k commands/day
- Serverless pricing
- Global replication
- REST API included

### Supabase (Alternative)

1. Sign up: https://supabase.com
2. Create project
3. Get PostgreSQL connection string
4. Add to `DATABASE_URL`

**Benefits:**
- Free tier: 500 MB database
- Includes auth & storage
- Realtime subscriptions
- GraphQL API

---

## Database Migrations (Production)

### Initial Deploy

```bash
pnpm prisma migrate deploy
pnpm db:seed  # Only if you want demo data
```

### Future Updates

```bash
# After schema changes, create migration locally:
pnpm prisma migrate dev --name describe-change

# Commit migration files to git
git add prisma/migrations
git commit -m "feat: add new table"
git push

# On server, run migration:
pnpm prisma migrate deploy
```

---

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
# Install
pnpm add @sentry/nextjs @sentry/node

# Configure in apps/api/src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

# Add to .env
SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
```

### LogTail (Logging)

```bash
# Install
pnpm add @logtail/node @logtail/winston

# Setup Winston logger
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

# Add to .env
LOGTAIL_TOKEN=your-token
```

### Uptime Monitoring

Use:
- **Uptime Robot:** https://uptimerobot.com (free)
- **Better Uptime:** https://betteruptime.com
- **Checkly:** https://checklyhq.com

Check:
- Frontend: `https://yourdomain.com`
- API Health: `https://api.yourdomain.com/health`

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test:e2e
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Performance Optimization

### 1. Enable Caching

```typescript
// apps/api/src/app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 300, // 5 minutes
    }),
  ],
})
```

### 2. Database Indexing

```prisma
// prisma/schema.prisma
model ContentItem {
  // ...
  @@index([projectId, type])
  @@index([createdAt])
}
```

### 3. Next.js Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 4. CDN Setup

Use Cloudflare or Vercel's CDN for static assets.

---

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Firewall configured
- [ ] SSH key-based auth only
- [ ] Regular backups scheduled
- [ ] Security headers set (Helmet.js)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

---

## Backup Strategy

### Database Backups

**Neon:**
- Automatic point-in-time recovery (7 days)
- Manual snapshots in dashboard

**Self-hosted:**
```bash
# Daily backup cron
0 2 * * * pg_dump marketing_autopilot | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Retention (keep 30 days)
find /backups -name "db-*.sql.gz" -mtime +30 -delete
```

### File Backups

```bash
# Rsync to backup server
rsync -avz --delete /path/to/sanyla user@backup-server:/backups/
```

---

## Scaling

### Horizontal Scaling

- Use PM2 cluster mode
- Load balancer (Nginx/HAProxy)
- Multiple app instances

```bash
# PM2 cluster
pm2 start dist/main.js -i max  # Use all CPU cores
```

### Vertical Scaling

- Upgrade VPS plan
- Increase PostgreSQL/Redis resources

### Database Scaling

- Read replicas for analytics queries
- Connection pooling (PgBouncer)

---

## Costs Estimate (Monthly)

### Minimal Setup (Free Tier)
- Neon PostgreSQL: $0
- Upstash Redis: $0
- Railway: $5-10
- OpenAI: $10-50
- **Total: $15-60/mo**

### Production Setup
- Neon Pro: $19
- Upstash Pro: $10
- Railway: $20-50
- Vercel Pro: $20
- OpenAI: $50-200
- Sentry: $26
- **Total: $145-325/mo**

### Enterprise Setup
- Dedicated PostgreSQL: $50-200
- Redis Enterprise: $50
- VPS (4GB): $20-40
- Load Balancer: $10-20
- OpenAI: $200-1000
- **Total: $330-1310/mo**

---

## Support

- Deployment issues: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Email: support@sanyla.com

---

**Happy Deploying!** 🚀
