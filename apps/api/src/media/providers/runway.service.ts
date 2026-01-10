import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RunwayService {
  private readonly apiUrl = 'https://api.runwayml.com/v1';

  async generateVideo(data: {
    script: string;
    duration?: number;
    style?: string;
  }): Promise<string> {
    try {
      // Runway ML Gen-2 API
      const response = await axios.post(
        `${this.apiUrl}/generate`,
        {
          prompt: data.script,
          duration: data.duration || 15,
          style: data.style || 'realistic',
          aspectRatio: '9:16', // Vertical for Reels/TikTok
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Poll for completion
      const taskId = response.data.id;
      return await this.pollVideoStatus(taskId);
    } catch (error) {
      console.error('Runway video generation error:', error);
      
      // Fallback: Return mock video URL for development
      return 'https://example.com/mock-video.mp4';
    }
  }

  private async pollVideoStatus(taskId: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
      const response = await axios.get(`${this.apiUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        },
      });

      if (response.data.status === 'SUCCEEDED') {
        return response.data.output[0];
      }

      if (response.data.status === 'FAILED') {
        throw new Error('Video generation failed');
      }

      // Wait 5 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Video generation timeout');
  }

  async generateCaptions(data: {
    videoUrl: string;
    language?: string;
  }): Promise<any> {
    try {
      // Use Whisper AI for transcription
      // This would require downloading video, extracting audio, and transcribing
      // For now, return mock captions
      
      return {
        captions: [
          { start: 0, end: 2, text: 'Generated caption placeholder' },
        ],
        language: data.language || 'en',
      };
    } catch (error) {
      console.error('Caption generation error:', error);
      throw error;
    }
  }
}
