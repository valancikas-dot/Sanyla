# 🚀 Kaip Naudoti Automatinę Kampanijų Sistemą

## 📋 Santrauka

Sukūrėme **visiškai automatinę** 7 dienų socialinių tinklų kampanijų generavimo sistemą.

**Jūs tik:**
1. ✅ Paspaudžiate mygtuką
2. ✅ Peržiūrite rezultatą (2-3 min)
3. ✅ Patvirtinate arba atmetate

**Viskas kitas AUTOMATINIS:**
- 🤖 AI sugeneruoja visus tekstus
- 🎨 DALL-E sukuria paveikslėlius
- 💾 Sistema išsaugo į DB
- 📅 Automatiškai suplanuoja postinimui

---

## 🎯 Ką Sukūrėme?

### 1. API Routes

#### `/api/ai/campaign-auto` (POST)
**Funkcija**: Sugeneruoja visą 7 dienų kampaniją

**Kas vyksta viduje?**
1. GPT-4 sukuria 7 dienų turinį (tekstus)
2. DALL-E sugeneruoja 21 paveikslėlį
3. Viskas išsaugoma į DB kaip DRAFT
4. Grąžina preview

**Laikas**: 2-3 minutės

#### `/api/ai/campaign-approve` (POST)
**Funkcija**: Patvirtina kampaniją ir suplanuoja postinimui

**Kas vyksta?**
1. Pakeičia visų postų status iš DRAFT → SCHEDULED
2. Dabar galima automatiškai postinti

#### `/api/ai/campaign-approve` (DELETE)
**Funkcija**: Atmeta ir ištrina kampaniją

### 2. React Komponentas

`/components/campaigns/AutoCampaignGenerator.tsx`

**UI su:**
- ✅ "Generuoti" mygtuku
- ✅ Loading state
- ✅ Preview visų 7 dienų
- ✅ Paveikslėlių rodymu
- ✅ "Patvirtinti" / "Atmesti" mygtukais

---

## 💻 Kaip Integruoti?

### Būdas 1: Pridėti į esamą projektų puslapį

```typescript
// apps/web/src/app/projects/[id]/page.tsx

import { AutoCampaignGenerator } from '@/components/campaigns/AutoCampaignGenerator';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Projektas</h1>
      
      {/* Čia pridėti komponentą */}
      <AutoCampaignGenerator projectId={params.id} />
      
      {/* Kiti project dalykai... */}
    </div>
  );
}
```

### Būdas 2: Atskirtas Campaign puslapis

```typescript
// apps/web/src/app/campaigns/auto/page.tsx

import { AutoCampaignGenerator } from '@/components/campaigns/AutoCampaignGenerator';

export default function AutoCampaignPage({ 
  searchParams 
}: { 
  searchParams: { projectId: string } 
}) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">
        🤖 Automatinė Kampanijos Generacija
      </h1>
      <p className="text-gray-600 mb-8">
        AI sugeneruos visą 7 dienų kampaniją su Reels, Facebook, LinkedIn ir TikTok turiniu
      </p>
      
      <AutoCampaignGenerator projectId={searchParams.projectId} />
    </div>
  );
}
```

---

## 🎬 Naudojimo Procesas

### 1. Vartotojas atidaro puslapį
```
┌──────────────────────────────┐
│  🤖 Automatinė Kampanija     │
│                              │
│  [Textarea: prompt]          │
│                              │
│  [✨ Generuoti Kampaniją]    │
└──────────────────────────────┘
```

### 2. Paspaudžia "Generuoti"
```
┌──────────────────────────────┐
│  ⏳ Generuojama kampanija... │
│  (gali užtrukti 2-3 min)     │
│                              │
│  [Loading spinner]           │
└──────────────────────────────┘
```

### 3. Po 2-3 minučių rodo preview
```
┌──────────────────────────────────────────────┐
│  📅 Kampanijos Peržiūra (7 dienos)          │
│  [Atmesti] [✅ Patvirtinti ir Planuoti]      │
└──────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  📅 DIENA 1 - Produkto Pristatymas          │
│  ⏰ 2026-01-15, 10:00                       │
│                                             │
│  📱 Instagram/Reels                         │
│  Caption: "Pristatome naują produktą! 🚀"  │
│  Reels tekstas: "Naujiena čia! 🔥"         │
│  [Reels Cover Image]                        │
│  Hashtags: #naujiena #produktas ...         │
│                                             │
│  📘 Facebook                                │
│  Post: "Džiaugiamės pranešti..."            │
│  CTA: "Sužinokite daugiau"                  │
│  [Facebook Visual Image]                    │
│                                             │
│  💼 LinkedIn                                │
│  Post: "Profesionalus pranešimas..."        │
│  [LinkedIn Infographic]                     │
│                                             │
│  📱 TikTok                                  │
│  Caption: "Check this out! 🔥"             │
│  Hashtags: #fyp #trending ...               │
└─────────────────────────────────────────────┘

... (7 tokių kortelių - po vieną kiekvienai dienai)
```

### 4. Patvirtina
```
✅ 21 postai suplanuoti sėkmingai!

Dabar galite:
- Peržiūrėti juos Calendar view
- Redaguoti prieš postinimą
- Auto-post per Social API
```

---

## 🗂️ Duomenų Bazėje

Po patvirtinimo:

### ContentBatch
```sql
id: batch_abc123
name: "7-Day Campaign - 15/01/2026"
projectId: project_xyz
```

### ContentItems (21-28 vnt)
```sql
-- Day 1
- id: item_1_ig   | type: REEL_SCRIPT | platform: instagram
- id: item_1_fb   | type: POST        | platform: facebook
- id: item_1_li   | type: POST        | platform: linkedin
- id: item_1_tt   | type: POST        | platform: tiktok

-- Day 2
- id: item_2_ig   | type: REEL_SCRIPT | platform: instagram
...

-- Day 7
...
```

### ScheduleJobs (21-28 vnt)
```sql
-- Day 1 - Instagram
scheduledFor: 2026-01-15 10:00
platform: META
status: SCHEDULED
payload: { caption, mediaUrl, ... }

-- Day 1 - Facebook
scheduledFor: 2026-01-15 10:00
platform: META
status: SCHEDULED
...
```

---

## 🎨 Paveikslėlių Pavyzdžiai

### Instagram Reels Cover (vertical, 9:16)
```
╔════════════════════╗
║                    ║
║   🚀 NAUJIENA!    ║
║                    ║
║   [Product image]  ║
║                    ║
║   Bold Colors      ║
║   Eye-catching     ║
║                    ║
╚════════════════════╝
```

### Facebook Visual (horizontal, 1.91:1)
```
╔════════════════════════════════╗
║  Professional, clean design    ║
║  [Main visual element]         ║
║  Engaging content              ║
╚════════════════════════════════╝
```

### LinkedIn Infographic
```
╔════════════════════════════════╗
║  📊 Professional Stats         ║
║  Corporate colors              ║
║  Data-driven visual            ║
╚════════════════════════════════╝
```

---

## 💰 Kaštai

### OpenAI API
- **GPT-4 Turbo**: ~$0.01 per 1K tokens
  - 7 dienų kampanija ≈ 4K tokens output = **~$0.04**
  
- **DALL-E 3 Standard**: $0.04 per image
  - 21 images = **$0.84**

**Viso vienai kampanijai**: ~**$0.88**

### Optimizavimas
- Naudoti `quality: 'standard'` (ne `hd`) = 2x pigiau
- Generuoti tik Instagram covers (7 images) = **$0.28**
- Cache GPT-4 atsakymus = greičiau

---

## 🔧 Troubleshooting

### "OPENAI_API_KEY not configured"
```bash
# .env.local
OPENAI_API_KEY=sk-your-key-here
```

### "Failed to generate images"
- Patikrinti OpenAI API limitą
- Patikrinti billing balance
- Naudoti `autoGenerateImages: false` testing'ui

### "Project not found"
- Patikrinti ar projectId egzistuoja
- Patikrinti user permissions

---

## 🚀 Kas Toliau?

### Testavimas
```bash
# 1. Start dev server
npm run dev

# 2. Navigate to
http://localhost:3000/campaigns/auto?projectId=YOUR_PROJECT_ID

# 3. Click "Generuoti"
# 4. Wait 2-3 minutes
# 5. Review and approve!
```

### Deployment
- ✅ API routes ready
- ✅ Component ready
- ✅ Database schema ready
- 🔄 Add to navigation menu
- 🔄 Add route to pages

### Auto-Posting
Dar reikia integruoti su:
- Meta Graph API (Instagram + Facebook)
- LinkedIn API
- TikTok API

Bet turinys **jau ready** DB!

---

## 📞 Support

Jei kažkas neveikia:
1. Patikrinti console errors
2. Patikrinti API response
3. Patikrinti DB records (Prisma Studio)
4. Patikrinti OpenAI API dashboard

---

## ✅ Checklist

Prieš naudojant:
- [ ] OPENAI_API_KEY sukonfigūruotas
- [ ] Database prisijungimas veikia
- [ ] Project sukurtas sistemoje
- [ ] Komponentas pridėtas į puslapį

Ready to test! 🚀
