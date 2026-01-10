import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DalleService } from './providers/dalle.service';
import { RunwayService } from './providers/runway.service';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private dalleService: DalleService,
    private runwayService: RunwayService,
  ) {}

  async generateImage(data: {
    prompt: string;
    projectId: string;
    style?: string;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    brandColors?: string[];
  }) {
    // Enhance prompt with brand colors if provided
    let enhancedPrompt = data.prompt;
    if (data.brandColors && data.brandColors.length > 0) {
      enhancedPrompt += ` Using brand colors: ${data.brandColors.join(', ')}`;
    }
    if (data.style) {
      enhancedPrompt += ` Style: ${data.style}`;
    }

    // Generate image with DALL-E
    const imageUrl = await this.dalleService.generateImage({
      prompt: enhancedPrompt,
      size: data.size || '1024x1024',
    });

    // Save to database
    const media = await this.prisma.generatedMedia.create({
      data: {
        type: 'IMAGE',
        provider: 'DALLE',
        prompt: data.prompt,
        url: imageUrl,
        metadata: {
          size: data.size || '1024x1024',
          style: data.style,
          brandColors: data.brandColors,
        },
        projectId: data.projectId,
      },
    });

    return media;
  }

  async generateVideo(data: {
    script: string;
    projectId: string;
    style?: string;
    duration?: number;
    voiceId?: string;
    backgroundMusic?: string;
  }) {
    // Generate video with Runway ML
    const videoUrl = await this.runwayService.generateVideo({
      script: data.script,
      duration: data.duration || 15,
      style: data.style,
    });

    // Save to database
    const media = await this.prisma.generatedMedia.create({
      data: {
        type: 'VIDEO',
        provider: 'RUNWAY',
        prompt: data.script,
        url: videoUrl,
        metadata: {
          duration: data.duration,
          style: data.style,
          voiceId: data.voiceId,
          backgroundMusic: data.backgroundMusic,
        },
        projectId: data.projectId,
      },
    });

    return media;
  }

  async generateCaptions(data: { videoUrl: string; language?: string }) {
    // Use Whisper AI for transcription
    const captions = await this.runwayService.generateCaptions({
      videoUrl: data.videoUrl,
      language: data.language || 'en',
    });

    return captions;
  }

  async getGeneratedMedia(projectId: string) {
    return this.prisma.generatedMedia.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
