# 🚀 Production Setup - Railway.app

## Kodėl Railway?

- **$5/mėn** = PostgreSQL + Redis + Deployment (viskas viename)
- **Auto-scaling** - auga su tavo vartotojais
- **Automatic backups** - kasdien
- **99.9% uptime** guarantee
- **Zero-config** deployment
- **FREE $5 credits** pirmai mėnesiui

---

## Setup (5 minutės):

### 1️⃣ **Registruokis Railway**

```
https://railway.app
→ Sign up with GitHub
```

### 2️⃣ **Sukurk naują projektą**

1. Paspausk "New Project"
2. Pasirink "Deploy from GitHub repo"
3. Connect GitHub → pasirink savo Sanyla repo

### 3️⃣ **Pridėk PostgreSQL**

1. Spausk "New" → "Database" → "PostgreSQL"
2. Railway automatiškai sukurs DB
3. Copy `DATABASE_URL` iš "Connect" tab

### 4️⃣ **Pridėk Redis**

1. Spausk "New" → "Database" → "Redis"
2. Railway automatiškai sukurs Redis
3. Copy `REDIS_URL` iš "Connect" tab

### 5️⃣ **Environment Variables**

Railway dashboard → tavo projektas → "Variables":

```bash
# Railway automatiškai užpildys:
DATABASE_URL=postgresql://...railway.app/railway
REDIS_URL=redis://...railway.app

# Tu pridėk:
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
ENCRYPTION_KEY=your-32-byte-encryption-key-base64
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://sanyla.up.railway.app

# Meta (kai bus):
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_REDIRECT_URI=https://sanyla.up.railway.app/api/auth/meta/callback
```

### 6️⃣ **Deploy**

```bash
# Railway automatiškai deploy'ins iš GitHub!
# Kiekvieną kartą kai push'ini kodą → auto deploy
```

---

## 💰 Kaina ir Skalė:

| Service | Kaina | Limits |
|---------|-------|--------|
| PostgreSQL | $5/mėn | 10GB storage, 1GB RAM |
| Redis | Included | 512MB RAM |
| Deployment | Included | 512MB RAM, 1 vCPU |
| Custom Domain | FREE | - |
| SSL Certificate | FREE | - |
| **TOTAL** | **$5/mėn** | **~500-1,000 vartotojų** |

**Pirmas mėnesis FREE** (gauni $5 credits)

### 📊 Skalės apribojimai Railway $5 plane:

**Concurrent vartotojai:**
- ~100-200 vienu metu aktyvių
- ~500-1,000 total registered users
- ~10,000 requests/day

**Kai viršiji limitą:**
- Upgrade į $20/mėn → ~5,000 vartotojų
- Arba $50/mėn → ~20,000 vartotojų

### 🚀 Scaling Path:

| Plan | Kaina | Vartotojai | DB | RAM |
|------|-------|------------|-----|-----|
| **Starter** | $5/mėn | ~500-1k | 10GB | 1GB |
| **Developer** | $20/mėn | ~5k | 50GB | 4GB |
| **Team** | $50/mėn | ~20k | 100GB | 8GB |
| **Google Cloud** | $100+/mėn | 100k+ | ∞ | ∞ |

---

## Alternatyva: Google Cloud Platform

Jei nori Google (brangesnis, bet galingesnis):

### Google Cloud Run + Cloud SQL:

**Kaina:**
- Cloud SQL (PostgreSQL): ~$10-25/mėn
- Cloud Run (App): $0-10/mėn (depends on traffic)
- Cloud Memorystore (Redis): ~$30/mėn
- **TOTAL: ~$40-65/mėn**

**Setup:**
```bash
# Įdiegti gcloud CLI
brew install --cask google-cloud-sdk

# Login
gcloud auth login

# Sukurti projektą
gcloud projects create sanyla-production

# Sukurti Cloud SQL
gcloud sql instances create sanyla-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=europe-west1

# Sukurti DB
gcloud sql databases create marketing_autopilot \
  --instance=sanyla-db

# Get connection string
gcloud sql instances describe sanyla-db
```

---

## ⚡ Quick Comparison:

| Feature | Railway | Google Cloud |
|---------|---------|--------------|
| Kaina | $5/mėn | $40-65/mėn |
| Setup laikas | 5 min | 30-60 min |
| Auto-deploy | ✅ GitHub | ⚠️ Manual setup |
| Scaling | Auto | Manual |
| Backups | Auto | Manual setup |
| SSL | Auto | Manual cert |
| **Rekomenduojama** | ✅ MVP → Growth | Production (high traffic) |

---

## 🎯 Mano Rekomendacija:

**Pradėk su Railway ($5/mėn)**
- Setup per 5 minutes
- Automatic everything
- Pigus kol augai

**Migruok į Google Cloud kai:**
- 10k+ daily users
- Reikia advanced analytics
- Reikia multi-region
- Turite dedicated DevOps

---

## Norint pradėti Railway:

1. Eik į: https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Pridėk PostgreSQL + Redis
5. Copy environment variables į Railway dashboard
6. **Deploy automatically happens!**

Gauni production URL: `https://sanyla.up.railway.app`

Galiu padėti setup dabar?
