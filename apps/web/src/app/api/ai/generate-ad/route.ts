import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy initialize OpenAI client
function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
}

interface ProductAnalysisRequest {
  productUrl?: string;
  productName?: string;
  adType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'GOOGLE';
  language: string;
}

export async function POST(req: NextRequest) {
  try {
    const { productUrl, productName, adType, platform, language } = await req.json() as ProductAnalysisRequest;

    if (!productUrl && !productName) {
      return NextResponse.json(
        { error: 'Product URL or name is required' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    // Step 1: Analyze product
    const productAnalysisPrompt = `You are a marketing expert AI. Analyze this product and extract key information.

Product: ${productName || productUrl}
${productUrl ? `Website: ${productUrl}` : ''}

Extract and provide in ${language} language:
1. Product features (5-7 key features)
2. Product benefits (3-5 main benefits)
3. Target audience demographics
4. Unique selling propositions (USPs)
5. Estimated price range (if known)
6. Suggested product categories/tags

Provide response in JSON format:
{
  "name": "product name",
  "features": ["feature1", "feature2", ...],
  "benefits": ["benefit1", "benefit2", ...],
  "targetAudience": "detailed audience description",
  "usps": ["usp1", "usp2", ...],
  "priceRange": "estimated price",
  "categories": ["category1", "category2", ...]
}`;

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: productAnalysisPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const productInfo = JSON.parse(analysisResponse.choices[0].message.content || '{}');

    // Step 2: Generate ad based on type
    let adGenerationPrompt = '';

    if (adType === 'VIDEO') {
      adGenerationPrompt = `Create a viral ${platform} Reels/Video ad script in ${language} language for:

Product: ${productInfo.name}
Features: ${productInfo.features.join(', ')}
Benefits: ${productInfo.benefits.join(', ')}
Target Audience: ${productInfo.targetAudience}

Create a 15-30 second video ad with:
1. Hook (attention-grabbing first 3 seconds with emoji)
2. 5 scenes with visual descriptions
3. Voiceover script
4. Call-to-action

Use emojis, be engaging, create FOMO.

JSON format:
{
  "hook": "hook text",
  "headline": "ad headline",
  "description": "short description",
  "scenes": ["scene1", "scene2", "scene3", "scene4", "scene5"],
  "voiceover": "complete voiceover script",
  "adCopy": "full social media post with emojis and formatting",
  "hashtags": ["#tag1", "#tag2", ...],
  "cta": "call to action",
  "duration": 30
}`;
    } else {
      adGenerationPrompt = `Create a ${platform} ${adType} ad in ${language} language for:

Product: ${productInfo.name}
Features: ${productInfo.features.join(', ')}
Benefits: ${productInfo.benefits.join(', ')}

Create engaging ad copy with:
1. Attention-grabbing headline
2. Description highlighting benefits
3. Full ad copy with emojis and formatting
4. 5-10 relevant hashtags
5. Strong call-to-action

Be persuasive, use emojis, create urgency.

JSON format:
{
  "headline": "headline",
  "description": "description",
  "adCopy": "full formatted ad text",
  "hashtags": ["#tag1", ...],
  "cta": "call to action"
}`;
    }

    const adResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: adGenerationPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const adContent = JSON.parse(adResponse.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      productInfo,
      ad: {
        ...adContent,
        type: adType,
        platform: platform,
      },
    });

  } catch (error: any) {
    console.error('Ad generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate ad' },
      { status: 500 }
    );
  }
}
