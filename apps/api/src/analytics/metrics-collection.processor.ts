import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { MetaInsightsService } from './meta-insights.service';

@Injectable()
@Processor('analytics-metrics', {
  concurrency: 3, // Process 3 jobs in parallel
})
export class MetricsCollectionProcessor extends WorkerHost {
  private readonly logger = new Logger(MetricsCollectionProcessor.name);

  constructor(
    private prisma: PrismaService,
    private metaInsights: MetaInsightsService,
  ) {
    super();
  }

  /**
   * CRON JOB: Collect metrics every 6 hours
   * Schedule: At minute 0 of every 6th hour
   */
  @Cron('0 */6 * * *', {
    name: 'collect-instagram-metrics',
    timeZone: 'Europe/Vilnius',
  })
  async collectMetricsCron() {
    this.logger.log('🔄 Starting scheduled Instagram metrics collection...');

    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    try {
      // Find all POSTED jobs from last 7 days that have Instagram media IDs
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const eligibleJobs = await this.prisma.scheduleJob.findMany({
        where: {
          status: 'POSTED',
          platformPostId: { not: null },
          publishedAt: { gte: sevenDaysAgo },
          // Only Instagram/Facebook posts (Meta platform)
          platform: { in: ['META', 'INSTAGRAM'] },
        },
        include: {
          socialAccount: true,
          metrics: {
            orderBy: { collectedAt: 'desc' },
            take: 1, // Get latest metric to avoid duplicate recent collections
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });

      this.logger.log(`Found ${eligibleJobs.length} eligible posts for metrics collection`);

      // Process each job
      for (const job of eligibleJobs) {
        try {
          // Skip if metrics collected recently (< 5 hours ago)
          const lastMetric = job.metrics[0];
          if (lastMetric) {
            const hoursSinceLastCollection = 
              (Date.now() - lastMetric.collectedAt.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceLastCollection < 5) {
              this.logger.debug(
                `Skipping job ${job.id} - metrics collected ${hoursSinceLastCollection.toFixed(1)}h ago`
              );
              continue;
            }
          }

          // Validate required data
          if (!job.socialAccount) {
            this.logger.warn(`Job ${job.id} has no social account - skipping`);
            errorCount++;
            continue;
          }

          if (!job.platformPostId) {
            this.logger.warn(`Job ${job.id} has no platformPostId - skipping`);
            errorCount++;
            continue;
          }

          // Fetch metrics from Instagram
          const insights = await this.metaInsights.fetchPostInsights(
            job.socialAccount.accessToken,
            job.platformPostId
          );

          // Calculate engagement rate
          const engagementRate = this.metaInsights.calculateEngagementRate(insights);

          // Save to database
          await this.prisma.socialMetric.create({
            data: {
              scheduleJobId: job.id,
              impressions: insights.impressions,
              likes: insights.likes,
              comments: insights.comments,
              saves: insights.saves,
              shares: insights.shares,
              engagementRate,
            },
          });

          this.logger.log(
            `✅ Metrics saved for job ${job.id}: ${insights.impressions} impressions, ` +
            `${insights.likes} likes, ${(engagementRate * 100).toFixed(2)}% engagement`
          );

          successCount++;

        } catch (error: any) {
          this.logger.error(
            `❌ Failed to collect metrics for job ${job.id}: ${error.message}`
          );
          errorCount++;
          // Continue processing other jobs - NO FAIL FAST
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      this.logger.log(
        `✅ Metrics collection complete: ${successCount} success, ${errorCount} errors (${duration}s)`
      );

    } catch (error: any) {
      this.logger.error(`Failed to run metrics collection cron: ${error.message}`);
    }
  }

  /**
   * BullMQ processor for manual metrics collection jobs
   * Can be triggered via API or admin panel
   */
  async process(job: Job<any>): Promise<any> {
    const { scheduleJobId } = job.data;

    this.logger.log(`Processing manual metrics collection for job: ${scheduleJobId}`);

    const scheduleJob = await this.prisma.scheduleJob.findUnique({
      where: { id: scheduleJobId },
      include: { socialAccount: true },
    });

    if (!scheduleJob) {
      throw new Error(`Schedule job not found: ${scheduleJobId}`);
    }

    if (scheduleJob.status !== 'POSTED') {
      throw new Error(`Job ${scheduleJobId} is not POSTED (status: ${scheduleJob.status})`);
    }

    if (!scheduleJob.platformPostId) {
      throw new Error(`Job ${scheduleJobId} has no platformPostId`);
    }

    if (!scheduleJob.socialAccount) {
      throw new Error(`Job ${scheduleJobId} has no social account`);
    }

    // Fetch metrics
    const insights = await this.metaInsights.fetchPostInsights(
      scheduleJob.socialAccount.accessToken,
      scheduleJob.platformPostId
    );

    // Calculate engagement
    const engagementRate = this.metaInsights.calculateEngagementRate(insights);

    // Save to database
    const metric = await this.prisma.socialMetric.create({
      data: {
        scheduleJobId: scheduleJob.id,
        impressions: insights.impressions,
        likes: insights.likes,
        comments: insights.comments,
        saves: insights.saves,
        shares: insights.shares,
        engagementRate,
      },
    });

    return {
      success: true,
      metricId: metric.id,
      insights,
      engagementRate,
    };
  }
}
