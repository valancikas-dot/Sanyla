import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@Processor('schedule')
export class ScheduleProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { jobId } = job.data;

    const scheduleJob = await this.prisma.scheduleJob.findUnique({
      where: { id: jobId },
      include: {
        contentItem: true,
      },
    });

    if (!scheduleJob) {
      throw new Error('Schedule job not found');
    }

    if (scheduleJob.status !== 'SCHEDULED') {
      return { skipped: true, reason: 'Job is not in SCHEDULED status' };
    }

    // MVP: Mark as POSTED with payload stub
    // Real implementation would call platform APIs here
    const payload = {
      platform: scheduleJob.platform,
      content: scheduleJob.contentItem.content,
      publishedAt: new Date().toISOString(),
      stub: true, // MVP marker
    };

    await this.prisma.scheduleJob.update({
      where: { id: jobId },
      data: {
        status: 'POSTED',
        payload,
      },
    });

    return { success: true, jobId };
  }
}
