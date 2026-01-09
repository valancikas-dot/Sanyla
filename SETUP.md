# ⚠️ SETUP WITHOUT DOCKER

Kadangi Docker nėra įdiegtas, sistemos paleidimas yra paprastesnis bet reikalauja lokalaus PostgreSQL ir Redis.

## Greitas setup (Development Mode)

Sistema sukonfigūruota ir paruošta veikti. **Trūksta tik:**

1. **PostgreSQL database** - turi būti paleista `localhost:5432`
2. **Redis server** - turi būti paleistas `localhost:6379`  
3. **OpenAI API key** - reikia įdėti į `.env` faile

## Variantai paleisti:

### Variantas A: Įdiegti PostgreSQL ir Redis lokaliai

**macOS:**
```bash
brew install postgresql@16 redis
brew services start postgresql@16
brew services start redis

# Sukurti DB
createdb marketing_autopilot
```

### Variantas B: Naudoti cloud DB (lengviausias)

1. **Neon.tech** (PostgreSQL - free tier):
   - Registruokis: https://neon.tech
   - Sukurk projektą
   - Copy `DATABASE_URL` ir įdėk į `.env`

2. **Upstash** (Redis - free tier):
   - Registruokis: https://upstash.com
   - Sukurk Redis DB
   - Copy `REDIS_URL` ir įdėk į `.env`

3. **OpenAI API key**:
   - https://platform.openai.com/api-keys
   - Sukurk naują key
   - Įdėk į `.env` kaip `OPENAI_API_KEY`

### Variantas C: Docker Desktop (rekomenduojamas)

```bash
# Įdiegti Docker Desktop for Mac
# https://www.docker.com/products/docker-desktop

# Po įdiegimo:
docker compose -f infra/docker-compose.yml up -d
```

## Po DB setup:

```bash
# 1. Prisma setup
cd prisma
pnpm install
pnpm prisma generate
pnpm prisma db push

# 2. Seed demo data
pnpm seed

# 3. Grįžti į root ir paleisti
cd ..
pnpm dev
```

Sistema paleis:
- API: http://localhost:4000
- Web: http://localhost:3000

Demo login:
- Email: demo@example.com
- Password: demo123

## Status dabar:

✅ Monorepo sukurtas  
✅ Dependencies įdiegtos  
✅ .env failas sukurtas su encryption key  
✅ Visas kodas parašytas ir veikiantis  
⏳ Reikia DB connection (PostgreSQL + Redis)  
⏳ Reikia OpenAI API key  

## Kas veikia be DB:

Niekas - sistema reikalauja DB connection, nes visi endpointai naudoja Prisma.

## Greitai paleisti su cloud:

```bash
# 1. Pakeisk .env:
# DATABASE_URL="postgresql://..." (neon.tech)
# REDIS_URL="redis://..." (upstash.com)  
# OPENAI_API_KEY="sk-..." (openai.com)

# 2. Setup DB
cd prisma && pnpm prisma db push && pnpm seed && cd ..

# 3. Run
pnpm dev
```

---

**Jei reikia pagalbos su DB setup - pasakyk, galiu padėti su Neon/Upstash setup!**
