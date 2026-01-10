import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { MetaService } from './providers/meta.service';
import { LinkedInService } from './providers/linkedin.service';
import { TikTokService } from './providers/tiktok.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, MetaService, LinkedInService, TikTokService],
  exports: [SocialService],
})
export class SocialModule {}
