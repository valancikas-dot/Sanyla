import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Fetch website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SanylaBot/1.0; +https://sanyla.site)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract text content (remove HTML tags)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10000); // Limit to first 10k characters

    return textContent;
  } catch (error) {
    console.error('Website scraping error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { websiteUrl } = await req.json();

    if (!websiteUrl) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
    }

    // Validate URL
    let url: URL;
    try {
      url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Scrape website
    const websiteContent = await scrapeWebsite(url.toString());

    // Analyze with GPT-4
    const openai = getOpenAI();
    
    const analysisPrompt = `You are a business analyst. Analyze the following website content and extract key business information.

Website Content:
${websiteContent}

Extract and return ONLY a JSON object with the following structure (no markdown, no code blocks, just pure JSON):
{
  "businessName": "Company name",
  "industry": "Primary industry/sector",
  "offer": "What products/services they offer - 2-3 sentences describing their main offering",
  "targetAudience": "Who are their ideal customers - describe demographics, needs, pain points",
  "keyBenefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "tone": "professional|friendly|casual|formal|inspiring",
  "uniqueSellingPoints": ["USP 1", "USP 2", "USP 3"],
  "country": "Country if mentioned",
  "city": "City if mentioned"
}

Be specific and detailed. Extract real information from the content, don't make assumptions.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a business intelligence analyst expert at extracting structured data from website content. Always respond with valid JSON only.' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const analysisText = response.choices[0]?.message?.content || '{}';
    
    // Parse JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanJson = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response:', analysisText);
      throw new Error('Failed to parse AI response');
    }

    return NextResponse.json({ 
      success: true,
      analysis,
      websiteUrl: url.toString(),
    });

  } catch (error: any) {
    console.error('Website analysis error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to analyze website',
      details: error.toString()
    }, { status: 500 });
  }
}
