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
        content = 'Unknown content type';
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
  language?: string;
}

// Language names for prompts - all 17 supported languages
const languageNames: Record<string, string> = {
  'lt': 'Lithuanian',
  'en': 'English', 
  'de': 'German',
  'fr': 'French',
  'es': 'Spanish',
  'it': 'Italian',
  'pl': 'Polish',
  'nl': 'Dutch',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'uk': 'Ukrainian',
  'cs': 'Czech',
  'sk': 'Slovak',
  'hu': 'Hungarian',
  'ro': 'Romanian',
  'bg': 'Bulgarian',
  'sv': 'Swedish',
};

function getLanguageName(code: string): string {
  return languageNames[code] || 'English';
}

// Detect language from user's prompt
function detectLanguageFromPrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Lithuanian patterns
  if (/[ąčęėįšųūž]|sukurk|sugeneruok|paruošk|parašyk|padėk|kampanij|nuotrauk|paveiksl/.test(lowerPrompt)) {
    return 'Lithuanian';
  }
  
  // German patterns
  if (/[äöüß]|erstelle|generiere|schreibe|hilf|kampagne/.test(lowerPrompt)) {
    return 'German';
  }
  
  // French patterns
  if (/[àâæçéèêëïîôùûü]|créer|générer|écrire|aide|campagne/.test(lowerPrompt)) {
    return 'French';
  }
  
  // Spanish patterns
  if (/[áéíóúñ¿¡]|crear|generar|escribir|ayuda|campaña/.test(lowerPrompt)) {
    return 'Spanish';
  }
  
  // Polish patterns
  if (/[ąćęłńóśźż]|utwórz|wygeneruj|napisz|pomóż|kampania/.test(lowerPrompt)) {
    return 'Polish';
  }
  
  // Russian patterns (Cyrillic)
  if (/[а-яА-ЯёЁ]/.test(lowerPrompt)) {
    return 'Russian';
  }
  
  // Ukrainian patterns (Cyrillic with specific chars)
  if (/[іїєґІЇЄҐ]/.test(lowerPrompt)) {
    return 'Ukrainian';
  }
  
  // Czech patterns
  if (/[áčďéěíňóřšťúůýž]|vytvořit|generovat|napsat|pomoct|kampaň/.test(lowerPrompt)) {
    return 'Czech';
  }
  
  // Default to English
  return 'English';
}

async function generateAdText(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  // Use project language if set, otherwise detect from user's prompt
  const detectedLanguage = detectLanguageFromPrompt(prompt);
  const language = context.language ? getLanguageName(context.language) : detectedLanguage;
  
  const systemPrompt = `You are a professional marketing specialist who creates advertising copy.
Your goal is to create attractive, converting advertising texts.

CRITICAL: Generate ALL content in ${language} language. Every single word must be in ${language}.

Project information:
- Name: ${context.name || 'Not specified'}
- Industry: ${context.industry || 'Not specified'}
- Offer: ${context.offer || 'Not specified'}
- Target audience: ${context.targetAudience || 'Not specified'}
- Tone: ${context.tone || 'professional'}
- Website: ${context.website || 'Not specified'}

Create 3 different versions of advertising copy in ${language}:
1. Short (Facebook/Instagram - up to 125 characters)
2. Medium (Google Ads - up to 90 character headline + 180 character description)
3. Long (Facebook/LinkedIn post - up to 500 characters)

Use emoji, CTA buttons, and engaging language. ALL TEXT MUST BE IN ${language.toUpperCase()}.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || 'Failed to generate content';
}

async function generateSocialPost(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  // Use project language if set, otherwise detect from user's prompt
  const detectedLanguage = detectLanguageFromPrompt(prompt);
  const language = context.language ? getLanguageName(context.language) : detectedLanguage;
  
  const systemPrompt = `You are a social media marketing expert who creates viral content.

CRITICAL: Generate ALL content in ${language} language. Every single word must be in ${language}.

Project information:
- Name: ${context.name || 'Not specified'}
- Industry: ${context.industry || 'Not specified'}
- Target audience: ${context.targetAudience || 'Not specified'}
- Tone: ${context.tone || 'professional'}

Create the following in ${language}:
1. INSTAGRAM POST (caption + 30 relevant hashtags)
2. FACEBOOK POST (longer, engaging)
3. LINKEDIN POST (professional, business-oriented)
4. TIKTOK/REELS description (short, with trending hashtags)

For each format include:
- Best posting time
- Recommended visual type
- CTA (call-to-action)

ALL TEXT MUST BE IN ${language.toUpperCase()}.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.9,
    max_tokens: 3000,
  });

  return response.choices[0]?.message?.content || 'Failed to generate content';
}

async function generateCampaign(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  // Use project language if set, otherwise detect from user's prompt
  const detectedLanguage = detectLanguageFromPrompt(prompt);
  const language = context.language ? getLanguageName(context.language) : detectedLanguage;
  
  const systemPrompt = `You are a strategic marketing consultant with 15+ years of experience.

CRITICAL: Generate ALL content in ${language} language. Every single word must be in ${language}.

Project information:
- Name: ${context.name || 'Not specified'}
- Industry: ${context.industry || 'Not specified'}
- Target audience: ${context.targetAudience || 'Not specified'}
- Website: ${context.website || 'Not specified'}

Create a detailed 30-day marketing campaign plan including:

1. GOALS AND KPIs
   - Specific, measurable objectives
   - Tracking metrics

2. AUDIENCE ANALYSIS
   - Persona description
   - Pain points
   - Buyer journey

3. WEEKLY PLAN (4 weeks)
   - Daily actions
   - Content types
   - Channels

4. BUDGET ALLOCATION
   - Channel percentages
   - Recommended budgets

5. A/B TESTING PLAN
   - What to test
   - How to evaluate

6. RETARGETING STRATEGY

Be specific and practical. ALL TEXT MUST BE IN ${language.toUpperCase()}.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || 'Create a complete marketing campaign' }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || 'Failed to generate campaign';
}

async function generateImageWithDALLE(openai: OpenAI, prompt: string, context: ProjectContext): Promise<string> {
  // Use project language if set, otherwise detect from user's prompt
  const detectedLanguage = detectLanguageFromPrompt(prompt);
  const language = context.language ? getLanguageName(context.language) : detectedLanguage;
  
  try {
    // First, create an optimized prompt for DALL-E
    const promptResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { 
          role: 'system', 
          content: `You are a DALL-E prompt engineer. Create an optimal DALL-E 3 prompt in English for generating a marketing advertisement image. The prompt should be detailed, professional and create a high-quality marketing visual.

Context:
- Business: ${context.name || 'Company'}
- Industry: ${context.industry || 'Business'}
- Tone: ${context.tone || 'professional'}

Return ONLY the prompt text, without any explanations.`
        },
        { role: 'user', content: prompt || 'Create an advertisement image' }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const dallePrompt = promptResponse.choices[0]?.message?.content || 
      'Professional marketing advertisement for business, modern design, high quality';

    // Generate image with DALL-E 3
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
    });

    const imageUrl = imageResponse.data?.[0]?.url || 'Failed to get URL';
    const revisedPrompt = imageResponse.data?.[0]?.revised_prompt || '';

    // Return result in the project's language
    if (language === 'Lithuanian') {
      return `DALL-E 3 SUGENERUOTAS PAVEIKSLĖLIS

PAVEIKSLĖLIO NUORODA:
${imageUrl}

NAUDOTAS PROMPT:
${dallePrompt}

DALL-E PATOBULINO Į:
${revisedPrompt || 'N/A'}

PATARIMAI:
- Atidarykite nuoroda naršyklėje ir išsaugokite
- Naudokite Canva pridėti tekstą
- Formatai: 1080x1080 (IG), 1200x628 (FB)

Nuoroda galioja 1 valandą - išsaugokite paveikslėlį!`;
    }
    
    return `DALL-E 3 GENERATED IMAGE

IMAGE URL:
${imageUrl}

PROMPT USED:
${dallePrompt}

DALL-E REVISED TO:
${revisedPrompt || 'N/A'}

TIPS:
- Open the link in browser and save
- Use Canva to add text
- Formats: 1080x1080 (IG), 1200x628 (FB)

Link expires in 1 hour - save the image!`;

  } catch (error: any) {
    console.error('DALL-E error:', error);
    
    if (language === 'Lithuanian') {
      return `PAVEIKSLĖLIO GENERAVIMAS NEPAVYKO

Klaida: ${error.message}

Galimos priežastys:
- OpenAI API limitas
- Netinkamas turinys (content policy)
- API rakto problema

Bandykite vėliau arba pakeiskite aprašymą.`;
    }
    
    return `IMAGE GENERATION FAILED

Error: ${error.message}

Possible reasons:
- OpenAI API rate limit
- Content policy violation
- API key issue

Try again later or change the description.`;
  }
}
