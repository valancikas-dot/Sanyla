import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, type, prompt, projectContext } = await req.json();

    if (!projectId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate content based on type
    const content = generateContent(type, prompt, projectContext);

    return NextResponse.json({ 
      content,
      type,
      projectId,
    });
  } catch (error) {
    console.error('AI Generate error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

interface ProjectContext {
  name?: string;
  industry?: string;
  offer?: string;
  targetAudience?: string;
  tone?: string;
}

function generateContent(type: string, prompt: string, context: ProjectContext): string {
  const projectName = context?.name || 'Jūsų verslas';
  const industry = context?.industry || 'paslaugos';
  const tone = context?.tone || 'professional';
  const audience = context?.targetAudience || '25-45m, Lietuva';
  
  switch (type) {
    case 'text':
      return generateAdText(projectName, industry, tone, prompt);
    case 'social':
      return generateSocialPost(projectName, industry, tone, prompt);
    case 'campaign':
      return generateCampaign(projectName, industry, audience, prompt);
    case 'image':
      return generateImagePrompt(projectName, industry, context?.offer || '');
    default:
      return 'Nežinomas turinio tipas';
  }
}

function generateAdText(name: string, industry: string, tone: string, prompt: string): string {
  const templates = [
    `🎯 ${name} - Jūsų patikimas ${industry} partneris!

✨ Ieškote profesionalių ${industry} paslaugų? 
Mes siūlome:
• Aukščiausios kokybės paslaugas
• Konkurencingas kainas
• Greitus terminus
• Individualų požiūrį

💡 Kodėl rinktis mus?
✅ 10+ metų patirtis rinkoje
✅ 500+ patenkintų klientų
✅ Garantuojamas rezultatas

📞 Susisiekite dabar ir gaukite NEMOKAMĄ konsultaciją!

#${industry.replace(/\s/g, '')} #verslas #kokybė`,

    `🚀 ${name} - Aukščiausia ${industry} kokybė!

Ar žinojote, kad 90% mūsų klientų grįžta pakartotinai?

Tai todėl, kad mes:
✓ Klausome jūsų poreikių
✓ Siūlome individualius sprendimus  
✓ Garantuojame rezultatą

🎁 SPECIALUS PASIŪLYMAS
Pirmai užklausai - 20% NUOLAIDA!

⏰ Pasiūlymas galioja ribotą laiką.
📱 Susisiekite dabar!

#${industry.replace(/\s/g, '')} #akcija #pasiulymas`,

    `💼 Profesionalios ${industry} paslaugos - ${name}

Mūsų privalumai:
▸ Greitas aptarnavimas
▸ Lankstūs mokėjimo būdai
▸ Garantija iki 2 metų
▸ Nemokamas pristatymas

💬 "Geriausi savo srityje!" - Tomas, Vilnius
💬 "Rekomenduoju visiems!" - Aurelija, Kaunas

📊 4.9/5 įvertinimas
🏆 500+ atliktų projektų

👉 Užsakykite dabar ir įsitikinkite patys!`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateSocialPost(name: string, industry: string, tone: string, prompt: string): string {
  const templates = [
    `📱 NAUJAS ĮRAŠAS

Hey! 👋

Šiandien norime pasidalinti kažkuo ypatingu... 

${name} komanda sunkiai dirba, kad galėtume jums pasiūlyti geriausias ${industry} paslaugas! 

💪 Mūsų misija - padėti jums pasiekti tikslus.

Ar žinojote, kad:
🔥 85% mūsų klientų rekomenduoja mus draugams
🔥 Vidutinis kliento pasitenkinimo įvertinimas - 4.9/5

Parašykite komentaruose "INFO" ir mes susisieksime! 

#${industry.replace(/\s/g, '')} #motivation #business #success`,

    `✨ Sveiki, draugai!

Diena prasidėjo su puikiomis žiniomis - gavome dar vieną 5⭐ atsiliepimą!

"${name} - tikri profesionalai. Rekomenduoju visiems!" 

🙏 Ačiū visiems klientams už pasitikėjimą!

Jei ir jums reikia ${industry} paslaugų - rašykite į DM arba skambinkite 📞

#klientuatsiliepimai #${industry.replace(/\s/g, '')} #ačiū`,

    `🔔 PRANEŠIMAS

${name} pristato NAUJĄ paslaugą! 🎉

Nuo šiol galite:
✅ Gauti konsultaciją online
✅ Užsisakyti per 5 min
✅ Mokėti dalimis

🎁 Pirmiesiems 10 klientų - dovana!

📲 Detalės - bio nuorodoje

#naujiena #${industry.replace(/\s/g, '')} #pasiulymas`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateCampaign(name: string, industry: string, audience: string, prompt: string): string {
  return `📊 MARKETINGO KAMPANIJOS PLANAS

🏢 Klientas: ${name}
📌 Industrija: ${industry}
🎯 Tikslinė auditorija: ${audience}

═══════════════════════════════════════════════════

📅 TRUKMĖ: 4 savaitės

═══════════════════════════════════════════════════

1️⃣ SAVAITĖ - SUSIDOMĖJIMO KĖLIMAS

Tikslai:
• Pasiekti 10,000+ žmonių
• Sukurti brand awareness

Veiksmai:
📱 Facebook/Instagram reklamos (3 skirtingi kūriniai)
📝 Blog straipsnis apie ${industry} tendencijas
📧 Email naujienlaiškis esamiems klientams
🎥 1 trumpas video (30-60 sek)

Biudžetas: 150€

═══════════════════════════════════════════════════

2️⃣ SAVAITĖ - ĮSITRAUKIMAS  

Tikslai:
• 500+ įsitraukimų (like, comment, share)
• Email open rate > 25%

Veiksmai:
🎮 Interaktyvus quiz arba konkursas
⭐ Klientų atsiliepimai (3-5 video/tekstai)
📺 Live sesija Instagram/Facebook
📱 Retargeting reklamos

Biudžetas: 200€

═══════════════════════════════════════════════════

3️⃣ SAVAITĖ - KONVERSIJA

Tikslai:
• 50+ užklausų/pardavimų
• ROAS > 3x

Veiksmai:
🎁 Specialus riboto laiko pasiūlymas (-20% arba dovana)
📱 Retargeting su konversijos tikslu
📧 Priminimo email sekos (3 laiškai)
📲 SMS kampanija (jei turite bazę)

Biudžetas: 300€

═══════════════════════════════════════════════════

4️⃣ SAVAITĖ - LOJALUMAS

Tikslai:
• Išlaikyti klientus
• Gauti rekomendacijas

Veiksmai:
💌 Padėkos laiškai pirkusiems
🎁 Nuolaidų kodai sekančiam pirkimui
👥 "Rekomenduok draugui" programa
📊 Apklausa ir atsiliepimų rinkimas

Biudžetas: 100€

═══════════════════════════════════════════════════

💰 BENDRAS BIUDŽETAS: 750€
📈 TIKĖTINI REZULTATAI:
   • +50% svetainės lankytojai
   • +30% užklausų
   • 50-100 naujų klientų
   • ROAS 3-5x

═══════════════════════════════════════════════════

📋 KPI SEKIMAS:
□ Savaitiniai ataskaitos susitikimai
□ UTM parametrai visoms nuorodoms
□ Conversion tracking pixel
□ A/B testavimas reklamoms

═══════════════════════════════════════════════════`;
}

function generateImagePrompt(name: string, industry: string, offer: string): string {
  return `🖼️ PAVEIKSLĖLIO GENERAVIMO GIDAS

Pagal jūsų projekto duomenis, rekomenduojame:

═══════════════════════════════════════════════════

📐 FORMATAI

• Facebook feed: 1200 x 628 px
• Facebook stories: 1080 x 1920 px
• Instagram feed: 1080 x 1080 px
• Instagram stories: 1080 x 1920 px
• LinkedIn: 1200 x 627 px
• Twitter: 1600 x 900 px

═══════════════════════════════════════════════════

🎨 REKOMENDUOJAMA SPALVŲ PALETĖ

Pagrindinė: #3B82F6 (mėlyna - pasitikėjimas)
Akcentas: #8B5CF6 (violetinė - kūrybiškumas)
Papildoma: #10B981 (žalia - augimas)
Fonas: #F8FAFC (šviesi, švari)

═══════════════════════════════════════════════════

📝 TEKSTAS PAVEIKSLĖLYJE

Antraštė: "${name}"
Subheadline: "${offer || `Profesionalios ${industry} paslaugos`}"
CTA: "Sužinoti daugiau →"

═══════════════════════════════════════════════════

🎯 AI PROMPT (Midjourney/DALL-E)

"Professional marketing banner for ${industry} business, 
modern minimalist design, blue and purple gradient, 
clean typography, business professional style, 
high quality, 4k, commercial photography style"

═══════════════════════════════════════════════════

💡 PATARIMAI

✓ Naudokite mažai teksto (max 20% ploto)
✓ Aiškus CTA mygtukas
✓ Aukštos kokybės nuotraukos
✓ Kontrastingos spalvos
✓ Mobile-first dizainas

═══════════════════════════════════════════════════

🔧 REKOMENDUOJAMI ĮRANKIAI

• Canva - lengvas redagavimas
• Adobe Express - profesionalūs template'ai
• Figma - custom dizainas
• Midjourney/DALL-E - AI generuoti vaizdai
• Remove.bg - fono pašalinimas`;
}
