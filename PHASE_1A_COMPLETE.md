# PHASE 1A — Database Migration COMPLETE ✅

## 📋 Summary

Database schema updated to support AI cost control system.

## 🔧 Changes Made

### 1. User Model Updates
**File:** `prisma/schema.prisma` + `apps/web/prisma/schema.prisma`

**Added fields:**
```prisma
model User {
  // ...existing fields
  aiCredits   Int      @default(100)   // AI credits balance
  creditsPlan String   @default("free") // Subscription tier
  
  // New relations
  creditLogs  CreditLog[]
  campaigns   Campaign[]
}
```

**Why:**
- `aiCredits` - Tracks remaining generation credits (default 100 for free tier)
- `creditsPlan` - Future-proof for paid tiers (free/pro/enterprise)
- Relations enable querying user's campaigns and credit history

---

### 2. Campaign Model (NEW)
**Purpose:** Track AI-generated campaigns with cost attribution

```prisma
model Campaign {
  id        String   @id @default(cuid())
  name      String?                      // Optional campaign name
  prompt    String   @db.Text            // Original user prompt
  aiCost    Int      @default(0)         // Credits spent
  status    String   @default("DRAFT")   // DRAFT | APPROVED | PUBLISHED
  userId    String                       // Who generated it
  projectId String                       // Which project
  batchId   String?                      // Links to 7-day ContentBatch
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  user    User          @relation(...)
  project Project       @relation(...)
  batch   ContentBatch? @relation(...)
  
  // Indexes for performance
  @@index([userId])
  @@index([projectId])
  @@index([createdAt])
}
```

**Why:**
- **Tracks cost per campaign** - Know how many credits each generation uses
- **Groups 7-day content** - Links to ContentBatch for organizational clarity
- **Enables user limits** - Can query total campaigns per user per period
- **Status tracking** - Distinguish drafts from published campaigns

**Why NOT extend ContentItem?**
- ContentItem is generic (POST, REEL_SCRIPT, INSIGHT, etc.)
- Campaign is specific to AI generation workflow
- Cleaner separation of concerns

---

### 3. CreditLog Model (NEW)
**Purpose:** Audit trail for AI credit usage

```prisma
model CreditLog {
  id        String   @id @default(cuid())
  action    String                  // CAMPAIGN_GENERATE, IMAGE_GENERATE, etc.
  cost      Int                     // Credits deducted
  userId    String                  // Who used credits
  metadata  Json?                   // {projectId, campaignId, modelUsed, etc.}
  createdAt DateTime @default(now())
  
  user User @relation(...)
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

**Why CreditLog instead of UsageLog?**
- `UsageLog` already exists for **organization limits** (AI_IMAGE, PROJECT quotas)
- `CreditLog` is for **user-level AI credits** (billing/cost control)
- Separate tables = cleaner queries, no conflicting logic

**Why metadata as Json?**
- Flexible for different action types
- Can store: `{projectId, campaignId, modelUsed: "gpt-4", tokensUsed: 2048}`
- Enables detailed cost analysis later

---

### 4. Project Model Updates
**Added relation:**
```prisma
model Project {
  // ...existing
  campaigns Campaign[]
}
```

**Why:**
- Enables querying all campaigns per project
- Future feature: Project-level credit limits

---

### 5. ContentBatch Model Updates
**Added relation:**
```prisma
model ContentBatch {
  // ...existing
  campaigns Campaign[]
}
```

**Why:**
- Links 7-day campaign batches to their Campaign record
- Makes it easy to find which batch belongs to which generation

---

## 📁 Files Modified

1. `/prisma/schema.prisma` - Main schema
2. `/apps/web/prisma/schema.prisma` - Web app schema (monorepo sync)
3. `/prisma/migrations/20260116_add_ai_cost_control/migration.sql` - Migration SQL

---

## 🚀 Migration SQL

**Location:** `prisma/migrations/20260116_add_ai_cost_control/migration.sql`

**What it does:**
1. Adds `aiCredits` and `creditsPlan` columns to `users` table
2. Creates `campaigns` table with foreign keys
3. Creates `credit_logs` table with indexes
4. Sets up proper CASCADE rules for deletions
5. Adds performance indexes
6. Includes SQL comments for documentation

**To apply:**
```bash
# Production (Railway)
npx prisma migrate deploy

# Local (if DATABASE_URL set)
psql $DATABASE_URL < prisma/migrations/20260116_add_ai_cost_control/migration.sql
```

---

## ✅ Validation

Both schemas validated successfully:
```bash
✅ prisma/schema.prisma - formatted
✅ apps/web/prisma/schema.prisma - formatted
```

No syntax errors, relations properly defined.

---

## 🎯 What This Enables (Next Phases)

**PHASE 1B** can now:
- Check `user.aiCredits` before campaign generation
- Deduct credits after successful generation
- Create `Campaign` record with `aiCost`
- Log transaction in `CreditLog`

**PHASE 1C** can:
- Query `user.aiCredits` for UI display
- Query `creditLogs` for usage history
- Filter campaigns by status/user/project

**Future capabilities:**
- Per-user usage analytics
- Credit top-up flows (when Stripe integrated)
- Project-level budgets
- Cost estimation before generation

---

## 🛑 PHASE 1A COMPLETE

Database layer ready for cost control implementation.

**Next step:** PHASE 1B (API logic for credit checking/deduction)

Do NOT proceed without explicit approval.
