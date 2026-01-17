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

  /**
   * Rewrite underperforming post - ONLY hook and CTA
   * Keep middle content unchanged
   * 
   * @param originalCaption - Full original Instagram caption
   * @param engagementRate - Current engagement rate (e.g., 0.005 = 0.5%)
   * @returns Object with newHook and newCTA
   */
  async rewriteUnderperformingPost(
    originalCaption: string,
    engagementRate: number
  ): Promise<{ hook: string; cta: string }> {
    const systemPrompt = `You are an Instagram optimization expert.
Your task: Rewrite ONLY the hook (opening 1-2 sentences) and CTA (call-to-action at the end).
Keep the middle content EXACTLY as it is.

RULES:
- Hook: Make it attention-grabbing, curiosity-driven, or problem-focused
- CTA: Make it clear, actionable, and engagement-focused (e.g., "Save this for later", "Share with someone who needs this")
- Do NOT change the middle content
- Keep the same language as the original
- Return JSON: { "hook": "...", "cta": "..." }`;

    const userPrompt = `Original caption (engagement rate: ${(engagementRate * 100).toFixed(2)}%):

${originalCaption}

Rewrite ONLY the hook and CTA to improve engagement.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8, // Higher creativity for rewriting
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    
    if (!parsed.hook || !parsed.cta) {
      throw new Error('Invalid response format: missing hook or cta');
    }

    return {
      hook: parsed.hook,
      cta: parsed.cta,
    };
  }
}
