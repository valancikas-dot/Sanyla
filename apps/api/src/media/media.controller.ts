import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // Generate image with DALL-E
  @Post('generate/image')
  async generateImage(
    @Body()
    data: {
      prompt: string;
      projectId: string;
      style?: string;
      size?: '1024x1024' | '1792x1024' | '1024x1792';
      brandColors?: string[];
    },
  ) {
    return this.mediaService.generateImage(data);
  }

  // Generate video with Runway/Synthesia
  @Post('generate/video')
  async generateVideo(
    @Body()
    data: {
      script: string;
      projectId: string;
      style?: string;
      duration?: number;
      voiceId?: string;
      backgroundMusic?: string;
    },
  ) {
    return this.mediaService.generateVideo(data);
  }

  // Generate video captions
  @Post('captions/generate')
  async generateCaptions(
    @Body() data: {
      videoUrl: string;
      language?: string;
    },
  ) {
    return this.mediaService.generateCaptions(data);
  }

  // Get generated media
  @Get(':projectId')
  async getGeneratedMedia(@Param('projectId') projectId: string) {
    return this.mediaService.getGeneratedMedia(projectId);
  }
}
