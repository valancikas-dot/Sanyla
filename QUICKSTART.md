# 🚀 AI MARKETING AUTOPILOT - QUICK START GUIDE

## ✅ Esate čia (Step-by-Step):

### 1️⃣ **Sukurti duomenų bazę** (2 min)

#### **Greičiausias būdas - Neon PostgreSQL (NEMOKAMA):**
1. Eikite į https://neon.tech
2. Užsiregistruokite su GitHub/Google
3. Sukurkite naują projektą
4. Nukopijuokite connection string (prasideda `postgresql://`)
5. Įklijuokite į `.env` failą kaip `DATABASE_URL`

**Pavyzdys:**
```
DATABASE_URL="postgresql://user:pass@ep-cool-sun-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

---

### 2️⃣ **Sukurti Redis (queue sistemai)** (2 min)

#### **Greičiausias būdas - Upstash Redis (NEMOKAMA):**
1. Eikite į https://upstash.com
2. Užsiregistruokite
3. Create Database → Pasirinkite regioną (pvz. EU-West-1)
4. Nukopijuokite:
   - Endpoint (be portas) → `REDIS_HOST`
   - Port → `REDIS_PORT`
   - Password → `REDIS_PASSWORD`

**Pavyzdys:**
```
REDIS_HOST="golden-sun-12345.upstash.io"
REDIS_PORT="6379"
REDIS_PASSWORD="AYC7aXXXXXXXXXXX"
```

---

### 3️⃣ **Gauti OpenAI API raktą** (3 min)

1. Eikite į https://platform.openai.com/api-keys
2. Sign Up / Login
3. Create new secret key
4. Nukopijuokite raktą (prasideda `sk-proj-...`)
5. Įklijuokite į `.env` kaip `OPENAI_API_KEY`

**Pastaba:** Reikės pridėti $5+ kredito į paskyrą.

**Pavyzdys:**
```
OPENAI_API_KEY="sk-proj-xxx_your_real_key_here_xxxxxxxxxxxxx"
```

---

### 3.5️⃣ **Firebase (jau sukonfigūruota!) ✅** (0 min)

**Firebase projektas jau sukurtas ir sujungtas!**

✅ **Projektas:** Sanyla  
✅ **Analytics:** G-4BXJ3MFSF3  
✅ **Environment variables:** Jau `.env` faile  

**Ką galite daryti su Firebase:**
- 📊 **Analytics** - Automatiškai seka vartotojų veiksmus
- 🔥 **Firestore** - Real-time duomenų bazė (papildoma)
- 🔐 **Auth** - Google/Facebook login (ateityje)
- 📦 **Storage** - Nuotraukų/video saugojimas (ateityje)

📖 **Daugiau info:** Skaitykite `FIREBASE.md` dokumentaciją

**Norite pridėti analytics tracking?** Žiūrėkite `FIREBASE.md` → "How to Use Analytics"

---

### 4️⃣ **Sukurti duomenų bazės lenteles** (30 sec)

```bash
cd prisma
pnpm prisma generate   # Sugeneruoja Prisma klientą
pnpm prisma db push    # Sukuria lenteles
pnpm seed              # Įkelia demo duomenis
```

---

### 5️⃣ **Paleisti sistemą** (10 sec)

```bash
cd ..   # Grįžti į root folderį
pnpm dev
```

**Atsidaro 2 servai:**
- 🌐 Frontend: http://localhost:3000
- ⚙️ Backend API: http://localhost:4000

---

### 6️⃣ **Prisijungti ir testuoti** 

**Demo paskyra:**
- Email: `demo@example.com`
- Password: `demo123`

**Testuojamų funkcijų checklist:**
- ✅ Prisijungti
- ✅ Pasirinkti "Demo Organization"
- ✅ Atidaryti "Demo Coffee Shop" projektą
- ✅ Generate → Sugeneruoti 30-dienų strategiją
- ✅ Generate → Sugeneruoti 20 postų
- ✅ Content → Peržiūrėti/kopijuoti turinį
- ✅ Schedule → Suplanuoti postą
- ✅ Analytics → Peržiūrėti insights

---

## 🔧 Jei nepavyksta paleisti:

### Problema: "Cannot connect to database"
**Sprendimas:**
1. Patikrinkite ar `DATABASE_URL` prasideda `postgresql://`
2. Patikrinkite ar pabaigoje yra `?sslmode=require` (Neon reikalauja)
3. Testuokite connection: `pnpm prisma db pull`

### Problema: "Redis connection failed"
**Sprendimas:**
1. Patikrinkite Upstash dashboard ar DB aktyvus
2. Patikrinkite ar `REDIS_PASSWORD` teisingas
3. Pabandykite per `redis-cli`: `redis-cli -h HOST -p PORT -a PASSWORD ping`

### Problema: "OpenAI API error 401"
**Sprendimas:**
1. Patikrinkite ar API key pradeda `sk-proj-`
2. Patikrinkite ar turite kredito: https://platform.openai.com/usage
3. Sukurkite naują raktą jei reikia

### Problema: TypeScript/Build errors
**Sprendimas:**
```bash
pnpm install           # Reinstall dependencies
rm -rf node_modules    # Nuclear option
pnpm install
```

---

## 📁 Projekto struktūra

```
/apps
  /api          - NestJS backend (port 4000)
  /web          - Next.js frontend (port 3000)
/packages
  /shared       - Bendri types/schemas
/prisma         - DB schema + seeds
/infra          - Docker compose (optional)
```

---

## 🌟 Alternatyvūs būdai paleisti DB/Redis

### Docker Compose (jei turite Docker Desktop):
```bash
cd infra
docker-compose up -d
```

### Local PostgreSQL (macOS):
```bash
brew install postgresql@15
brew services start postgresql@15
createdb marketing_autopilot
```

### Local Redis (macOS):
```bash
brew install redis
brew services start redis
```

---

## 🎯 Sekantis žingsnis po MVP:

- [ ] OAuth integracijos (Meta, TikTok, LinkedIn)
- [ ] Tikri API calls socialiniams tinklams (vietoj mock)
- [ ] File upload sistemai (images/videos)
- [ ] Webhooks iš platformų (post performance)
- [ ] Advanced analytics (GA4 integration)
- [ ] Team collaboration features
- [ ] Payment/Subscription sistema

---

**Klausimai? Sukurkite issue arba rašykite support@example.com** 🚀
