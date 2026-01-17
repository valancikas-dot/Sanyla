import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetaService } from '../social/providers/meta.service';

@Injectable()
@Processor('schedule', {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000, // 10 jobs per second max
  },
})
export class ScheduleProcessor extends WorkerHost {
  private readonly logger = new Logger(ScheduleProcessor.name);

  constructor(
    private prisma: PrismaService,
    private metaService: MetaService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { jobId } = job.data;

    this.logger.log(`Processing schedule job: ${jobId}`);

    const scheduleJob = await this.prisma.scheduleJob.findUnique({
      where: { id: jobId },
      include: {
        contentItem: true,
        socialAccount: true,
        project: true,
      },
    });

    if (!scheduleJob) {
      throw new Error(`Schedule job not found: ${jobId}`);
    }

    if (scheduleJob.status !== 'SCHEDULED') {
      this.logger.warn(`Job ${jobId} skipped - status: ${scheduleJob.status}`);
      return { skipped: true, reason: `Job is not in SCHEDULED status (current: ${scheduleJob.status})` };
    }

    // Validate social account connection
    if (!scheduleJob.socialAccountId || !scheduleJob.socialAccount) {
      await this.prisma.scheduleJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: 'No social account connected. Please connect Instagram account.',
        },
      });
      throw new Error('No social account connected');
    }

    // Check token validity
    if (scheduleJob.socialAccount.status !== 'ACTIVE') {
      await this.prisma.scheduleJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: `Social account status: ${scheduleJob.socialAccount.status}. Please reconnect Instagram.`,
        },
      });
      throw new Error('Social account not active');
    }

    // Set status to POSTING
    await this.prisma.scheduleJob.update({
      where: { id: jobId },
      data: { status: 'POSTING' },
    });

    try {
      // Extract content from payload or contentItem
      const content = scheduleJob.contentItem.content as any;
      const payload = scheduleJob.payload as any;

      // Build publishing data
      const imageUrl = payload?.mediaUrl || content?.coverImage || content?.image;
      const caption = payload?.caption || content?.caption || content?.post || content?.text;

      if (!imageUrl) {
        throw new Error('No image URL found in content. Cannot publish to Instagram.');
      }

      if (!caption) {
        throw new Error('No caption found in content. Cannot publish to Instagram.');
      }

      this.logger.log(`Publishing to Instagram: ${scheduleJob.socialAccount.accountName}`);
      this.logger.debug(`Image: ${imageUrl}`);
      this.logger.debug(`Caption: ${caption.substring(0, 50)}...`);

      // Call real Meta Graph API
      const platformPostId = await this.metaService.publishPost(
        {
          platform: 'INSTAGRAM',
          accountId: scheduleJob.socialAccount.accountId,
          accessToken: scheduleJob.socialAccount.accessToken,
        },
        {
          content: {
            imageUrl,
            caption,
          },
        },
      );

      // Update to POSTED with metadata
      await this.prisma.scheduleJob.update({
        where: { id: jobId },
        data: {
          status: 'POSTED',
          platformPostId,
          publishedAt: new Date(),
          error: null, // Clear any previous errors
        },
      });

      this.logger.log(`✅ Successfully published job ${jobId} - Instagram post ID: ${platformPostId}`);

      return {
        success: true,
        jobId,
        platformPostId,
        publishedAt: new Date().toISOString(),
      };

    } catch (error: any) {
      this.logger.error(`❌ Failed to publish job ${jobId}:`, error);

      // Determine if error is retryable
      const isTokenError = error.message?.includes('token') || 
                          error.message?.includes('OAuthException') ||
                          error.message?.includes('permission');
      
      const errorMessage = isTokenError 
        ? `Instagram authentication failed: ${error.message}. Please reconnect your Instagram account.`
        : `Publishing failed: ${error.message}`;

      // Update to FAILED
      await this.prisma.scheduleJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: errorMessage,
        },
      });

      // Don't retry token errors - fail fast
      if (isTokenError) {
        this.logger.error(`Token error detected - not retrying job ${jobId}`);
        throw new Error(errorMessage); // This will not retry
      }

      // Retry other errors
      throw error;
    }
  }
}
