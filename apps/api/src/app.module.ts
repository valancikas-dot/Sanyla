import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AiModule } from './ai/ai.module';
import { ContentModule } from './content/content.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SocialModule } from './social/social.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    AiModule,
    ContentModule,
    SchedulerModule,
    AnalyticsModule,
    SocialModule,
    MediaModule,
  ],
})
export class AppModule {}
