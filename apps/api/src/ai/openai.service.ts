import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OPENAI_API_KEY not set - AI features will not work');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateWithSchema<T>(systemPrompt: string, userPrompt: string, schema: any, maxRetries = 2): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const messages: any[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ];

        if (i > 0 && lastError) {
          messages.push({
            role: 'user',
            content: `Previous attempt failed validation: ${lastError.message}. Please fix the JSON to match the schema exactly.`,
          });
        }

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages,
          temperature: 0.7,
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No response from OpenAI');
        }

        const parsed = JSON.parse(content);
        const validated = schema.parse(parsed);

        return validated as T;
      } catch (error) {
        lastError = error as Error;
        if (i === maxRetries) {
          throw new Error(`Failed to generate valid response after ${maxRetries + 1} attempts: ${lastError.message}`);
        }
      }
    }

    throw lastError!;
  }

  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }
}
