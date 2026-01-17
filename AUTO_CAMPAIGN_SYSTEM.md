# 🤖 Automatinė 7 Dienų Kampanijų Sistema

## ✨ Kas tai?

Visiškai automatizuota AI sistema, kuri:
1. **Sugeneruoja** visą 7 dienų socialinių tinklų kampaniją
2. **Sukuria** DALL-E paveikslėlius kiekvienam postui
3. **Išsaugo** viską į duomenų bazę kaip DRAFT
4. **Leidžia jums** tik peržiūrėti ir patvirtinti

## 🎯 Funkcionalumas

### Platformos
- ✅ **Instagram/Reels** - su cover paveikslėliais
- ✅ **Facebook** - su vizualais
- ✅ **LinkedIn** - su profesionaliais grafikas
- ✅ **TikTok** - su caption ir hashtag'ais

### Kiekvienai dienai sukuriama:
- 📝 Caption'ai visoms platformoms
- 🖼️ DALL-E sugeneruoti paveikslėliai (3 per dieną)
- #️⃣ Optimizuoti hashtag'ai
- ⏰ Geriausias postinimo laikas
- 📅 Automatinis scheduling

## 🚀 Kaip naudoti?

### 1. Frontend integravimas

Pridėkite `AutoCampaignGenerator` komponentą bet kuriame puslapyje:

```tsx
import { AutoCampaignGenerator } from '@/components/campaigns/AutoCampaignGenerator';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Kampanijų Generatorius</h1>
      <AutoCampaignGenerator projectId={params.id} />
    </div>
  );
}
```

### 2. Vartotojo workflow

1. **Paspaudžia mygtuką** "Generuoti 7 Dienų Kampaniją"
2. **Laukia 2-3 minutes** (AI + DALL-E generacija)
3. **Peržiūri** visas 7 dienas su paveikslėliais
4. **Patvirtina** arba **Atmeta**
5. Jei patvirtino → **Automatiškai suplanuojama** postinimui

### 3. API Endpoints

#### Generuoti kampaniją
```bash
POST /api/ai/campaign-auto
Content-Type: application/json

{
  "projectId": "clxx123",
  "prompt": "Sukurk kampaniją apie naujus produktus",
  "autoGenerateImages": true
}
```

**Response:**
```json
{
  "success": true,
  "batchId": "batch_123",
  "totalDays": 7,
  "items": [...],
  "preview": [
    {
      "day": 1,
      "theme": "Produkto pristatymas",
      "date": "2026-01-15",
      "bestTime": "10:00",
      "instagram": {
        "caption": "...",
        "reelsText": "...",
        "reelsCover": "https://dall-e-url.com/image.png",
        ...
      },
      ...
    }
  ]
}
```

#### Patvirtinti kampaniją
```bash
POST /api/ai/campaign-approve
Content-Type: application/json

{
  "batchId": "batch_123"
}
```

**Response:**
```json
{
  "success": true,
  "approvedPosts": 21,
  "message": "21 posts scheduled successfully!"
}
```

#### Atmesti kampaniją
```bash
DELETE /api/ai/campaign-approve?batchId=batch_123
```

## 📊 Duomenų struktūra

### ContentBatch
```typescript
{
  id: string;
  name: "7-Day Campaign - 15/01/2026";
  description: "AI-generated campaign";
  projectId: string;
  items: ContentItem[];
}
```

### ContentItem
```typescript
{
  id: string;
  type: "REEL_SCRIPT" | "POST" | "IMAGE";
  title: "Day 1 - Instagram Reels - Theme";
  content: {
    platform: "instagram" | "facebook" | "linkedin" | "tiktok";
    caption: string;
    reelsText?: string;
    hashtags: string;
    coverImage?: string;
    image?: string;
  };
  metadata: {
    day: number;
    theme: string;
    bestTime: string;
  };
  scheduleJobs: ScheduleJob[];
}
```

### ScheduleJob
```typescript
{
  id: string;
  scheduledFor: DateTime;
  platform: "META" | "LINKEDIN" | "TIKTOK";
  status: "DRAFT" | "SCHEDULED" | "POSTED" | "FAILED";
  payload: {
    type: "reel" | "post";
    caption: string;
    mediaUrl: string;
  };
}
```

## 🎨 DALL-E Paveikslėlių Generavimas

Kiekvienai dienai sugeneruojami **3 paveikslėliai**:

1. **Instagram Reels Cover** (9:16, vertical)
   - Eye-catching
   - Bold colors
   - Space for text overlay

2. **Facebook Visual** (1.91:1, horizontal)
   - Clean, modern
   - Engaging content
   - Professional look

3. **LinkedIn Infographic** (1.91:1, horizontal)
   - Corporate style
   - Data-driven
   - Professional design

### Kaštai
- **Standard quality**: ~$0.04 per image
- **HD quality**: ~$0.08 per image
- **7 dienų kampanija**: ~21 images = **$0.84 - $1.68**

## ⚙️ Konfiguracija

### Environment Variables
```bash
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
```

### Prisma Schema
Sistema naudoja egzistuojančius modelius:
- ✅ `ContentBatch`
- ✅ `ContentItem`
- ✅ `ScheduleJob`
- ✅ `Project`

## 🔄 Workflow Schema

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Generate Campaign"                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GPT-4 generates 7 days of content                        │
│    - Instagram captions                                     │
│    - Facebook posts                                         │
│    - LinkedIn posts                                         │
│    - TikTok captions                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DALL-E generates images (21 total)                       │
│    - 7x Reels covers                                        │
│    - 7x Facebook visuals                                    │
│    - 7x LinkedIn infographics                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Save to Database as DRAFT                                │
│    - Create ContentBatch                                    │
│    - Create 21-28 ContentItems                              │
│    - Create 21-28 ScheduleJobs (status: DRAFT)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Show Preview to User                                     │
│    - All 7 days with images                                 │
│    - All platforms visible                                  │
│    - Approve/Reject buttons                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
    ┌─────────┐          ┌─────────┐
    │ APPROVE │          │ REJECT  │
    └────┬────┘          └────┬────┘
         │                    │
         ▼                    ▼
   ┌─────────────┐      ┌─────────────┐
   │ Change      │      │ Delete      │
   │ status to   │      │ entire      │
   │ SCHEDULED   │      │ batch       │
   └──────┬──────┘      └─────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Ready for auto-post │
   │ via Social API      │
   └─────────────────────┘
```

## 🎯 Pavyzdys

### Input:
```json
{
  "projectId": "abc123",
  "prompt": "Sukurk kampaniją apie naujo café atidarymą Vilniuje"
}
```

### Output (preview):
```
Day 1 - Grand Opening Announcement
├─ Instagram Reels: "Naujas café Vilniuje! ☕✨"
│  └─ Cover: [DALL-E image of café exterior]
├─ Facebook: "Jau šį ketvirtadienį atidarome duris..."
│  └─ Visual: [DALL-E image of interior]
└─ LinkedIn: "Profesionalus café space verslo susitikimams..."
   └─ Infographic: [DALL-E business-style image]

Day 2 - Menu Showcase
...

Day 7 - Special Promotion
...
```

## 📈 Performance

- **Generation time**: 2-3 minutes
- **Content quality**: Professional, ready-to-post
- **Languages**: 17 supported (auto-detect from project)
- **Platforms**: 4 (Instagram, Facebook, LinkedIn, TikTok)

## 🔐 Security

- ✅ Session-based auth (NextAuth)
- ✅ User must own the project
- ✅ DRAFT status by default
- ✅ Manual approval required
- ✅ Can modify before approving

## 🚀 Future Improvements

- [ ] Video generation for Reels
- [ ] A/B testing variants
- [ ] Performance analytics integration
- [ ] Auto-posting to social platforms
- [ ] Bulk editing before approval
- [ ] Template library

## 📝 Notes

- DALL-E images expire in 1 hour - save immediately!
- System auto-detects language from project settings
- Can regenerate specific days
- All content stored in database for history
