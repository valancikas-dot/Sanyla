import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

// Initialize OpenAI
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

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

    const openai = getOpenAI();
    let content = '';

    // Generate content based on type using real GPT-4
    switch (type) {
      case 'text':
        content = await generateAdText(openai, prompt, projectContext);
        break;
      case 'social':
        content = await generateSocialPost(openai, prompt, projectContext);
        break;
      case 'campaign':
        content = await generateCampaign(openai, prompt, projectContext);
        break;
      case 'image':
        content = await generateImageWithDALLE(openai, prompt, projectContext);
        break;
      default:
        content = 'Nežinomas turinio tipas';
    }

    return NextResponse.json({ 
      content,
      type,
      projectId,
    });
  } catch (error: any) {
    console.error('AI Generate error:', error);
    return NextResponse.json({ 
      error: error.message || 'AI generation failed',
      details: error.toString()
    }, { status: 500 });
  }
}

interface ProjectContext {
  name?: string;
  industry?: string;
  offer?: string;
  targetAudience?: string;
  tone?: string;
  website?: string;
}

async function generateAdText(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  const systemPrompt = `Tu esi profesionalus marketingo specialistas, kuris kuria reklamos tekstus lietuvių kalba.
Tavo tikslas - sukurti patrauklius, konvertuojančius reklamos tekstus.

Projekto informacija:
- Pavadinimas: ${context.name || 'Nenurodyta'}
- Industrija: ${context.industry || 'Nenurodyta'}
- Pasiūlymas: ${context.offer || 'Nenurodyta'}
- Tikslinė auditorija: ${context.targetAudience || 'Nenurodyta'}
- Tonas: ${context.tone || 'professional'}
- Svetainė: ${context.website || 'Nenurodyta'}

Sukurk 3 skirtingas reklamos teksto versijas:
1. Trumpa (Facebook/Instagram - iki 125 simbolių)
2. Vidutinė (Google Ads - iki 90 simbolių antraštė + 180 simbolių aprašymas)
3. Ilga (Facebook/LinkedIn post - iki 500 simbolių)

Naudok emoji, CTA mygtukus, ir įtraukiančią kalbą.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || `Sukurk reklamos tekstą ${context.industry || 'verslui'}` }
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || 'Nepavyko sugeneruoti turinio';
}

async function generateSocialPost(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  const systemPrompt = `Tu esi socialinių tinklų marketingo ekspertas, kuris kuria viralini turinį lietuvių kalba.

Projekto informacija:
- Pavadinimas: ${context.name || 'Nenurodyta'}
- Industrija: ${context.industry || 'Nenurodyta'}
- Tikslinė auditorija: ${context.targetAudience || 'Nenurodyta'}
- Tonas: ${context.tone || 'professional'}

Sukurk:
1. 📸 INSTAGRAM POST (caption + 30 hashtag'ų)
2. 📘 FACEBOOK POST (ilgesnis, įtraukiantis)
3. 💼 LINKEDIN POST (profesionalus, verslo orientuotas)
4. 🎵 TIKTOK/REELS aprašymas (trumpas, su trending hashtag'ais)

Kiekvienam formatui pridėk:
- Geriausią publikavimo laiką
- Rekomenduojamą vizualo tipą
- CTA (call-to-action)`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || `Sukurk socialinių tinklų turinį ${context.industry || 'verslui'}` }
    ],
    temperature: 0.9,
    max_tokens: 3000,
  });

  return response.choices[0]?.message?.content || 'Nepavyko sugeneruoti turinio';
}

async function generateCampaign(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  const systemPrompt = `Tu esi strateginis marketingo konsultantas su 15+ metų patirtimi.

Projekto informacija:
- Pavadinimas: ${context.name || 'Nenurodyta'}
- Industrija: ${context.industry || 'Nenurodyta'}
- Tikslinė auditorija: ${context.targetAudience || 'Nenurodyta'}
- Svetainė: ${context.website || 'Nenurodyta'}

Sukurk detalų 30 dienų marketingo kampanijos planą su:

1. � TIKSLAI IR KPI
   - Konkretūs, išmatuojami tikslai
   - Sekimo metrikos

2. 🎯 AUDITORIJOS ANALIZĖ
   - Personas aprašymas
   - Skausmo taškai
   - Pirkimo kelionė

3. 📅 SAVAITINIS PLANAS (4 savaitės)
   - Kiekvienos dienos veiksmai
   - Turinio tipai
   - Kanalai

4. 💰 BIUDŽETO PASKIRSTYMAS
   - Kanalų procentai
   - Rekomenduojami biudžetai

5. � A/B TESTAVIMO PLANAS
   - Ką testuoti
   - Kaip vertinti

6. 🔄 RETARGETING STRATEGIJA

Būk konkretus ir praktiškas.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || `Sukurk marketingo kampaniją ${context.industry || 'verslui'}` }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || 'Nepavyko sugeneruoti kampanijos';
}

async function generateImageWithDALLE(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  try {
    // First, create an optimized prompt for DALL-E
    const promptResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { 
          role: 'system', 
          content: `Tu esi DALL-E prompt inžinierius. Sukurk optimalų DALL-E 3 prompt anglų kalba 
          reklamos paveikslėliui generuoti. Prompt turi būti detalus, profesionalus ir sukurti 
          aukštos kokybės marketingo vizualą.
          
          Kontekstas:
          - Verslas: ${context.name || 'Company'}
          - Industrija: ${context.industry || 'Business'}
          - Tonas: ${context.tone || 'professional'}
          
          Grąžink TIK prompt tekstą, be jokių paaiškinimų.`
        },
        { role: 'user', content: prompt || `Sukurk reklamos paveikslėlį ${context.industry || 'verslui'}` }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const dallePrompt = promptResponse.choices[0]?.message?.content || 
      `Professional marketing advertisement for ${context.industry || 'business'}, modern design, high quality`;

    // Generate image with DALL-E 3
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
    });

    const imageUrl = imageResponse.data?.[0]?.url || 'Nepavyko gauti nuorodos';
    const revisedPrompt = imageResponse.data?.[0]?.revised_prompt || '';

    return `🎨 DALL-E 3 SUGENERUOTAS PAVEIKSLĖLIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖼️ PAVEIKSLĖLIO NUORODA:
${imageUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 NAUDOTAS PROMPT:
${dallePrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 DALL-E PATOBULINO Į:
${revisedPrompt || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 PATARIMAI:
• Atidarykite nuorodą naršyklėje ir išsaugokite
• Naudokite Canva pridėti tekstą
• Formatai: 1080x1080 (IG), 1200x628 (FB)

⏰ Nuoroda galioja 1 valandą - išsaugokite paveikslėlį!`;

  } catch (error: any) {
    console.error('DALL-E error:', error);
    return `❌ PAVEIKSLĖLIO GENERAVIMAS NEPAVYKO

Klaida: ${error.message}

Galimos priežastys:
• OpenAI API limitas
• Netinkamas turinys (content policy)
• API rakto problema

Bandykite vėliau arba pakeiskite aprašymą.`;
  }
}
