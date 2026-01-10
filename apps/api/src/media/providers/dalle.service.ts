import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class DalleService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateImage(data: {
    prompt: string;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
  }): Promise<string> {
    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: data.prompt,
        size: data.size || '1024x1024',
        quality: data.quality || 'standard',
        n: 1,
      });

      return response.data[0].url!;
    } catch (error) {
      console.error('DALL-E generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }

  async generateVariations(data: {
    prompt: string;
    count: number;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
  }): Promise<string[]> {
    const images: string[] = [];

    // Generate multiple variations with slightly different prompts
    for (let i = 0; i < data.count; i++) {
      const variantPrompt = `${data.prompt} (variation ${i + 1})`;
      const imageUrl = await this.generateImage({
        prompt: variantPrompt,
        size: data.size,
      });
      images.push(imageUrl);
    }

    return images;
  }
}
