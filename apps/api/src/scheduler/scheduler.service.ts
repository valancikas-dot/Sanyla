import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { AuditService } from '../common/audit.service';
import { CreateScheduleJobSchema } from '@marketing-autopilot/shared';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue('schedule') private scheduleQueue: Queue,
    private prisma: PrismaService,
    private projectsService: ProjectsService,
    private auditService: AuditService,
  ) {}

  async createScheduleJob(projectId: string, userId: string, data: any) {
    await this.projectsService.getProject(projectId, userId); // verify access

    const parsed = CreateScheduleJobSchema.parse(data);

    // Get default social account for this project and platform
    let socialAccountId = parsed.socialAccountId; // Allow explicit override
    
    if (!socialAccountId && parsed.platform === 'META') {
      // Auto-select first active Instagram account for this project
      const socialAccount = await this.prisma.socialAccount.findFirst({
        where: {
          projectId,
          platform: 'INSTAGRAM',
          status: 'ACTIVE',
        },
      });
      
      if (socialAccount) {
        socialAccountId = socialAccount.id;
      }
    }

    const job = await this.prisma.scheduleJob.create({
      data: {
        scheduledFor: new Date(parsed.scheduledFor),
        platform: parsed.platform,
        contentItemId: parsed.contentItemId,
        projectId,
        socialAccountId, // Link to social account
        status: 'SCHEDULED',
      },
    });

    // Add to queue
    const delay = new Date(parsed.scheduledFor).getTime() - Date.now();
    await this.scheduleQueue.add(
      'publish',
      { jobId: job.id },
      { 
        delay: delay > 0 ? delay : 0,
        attempts: 3, // Retry 3 times
        backoff: {
          type: 'exponential',
          delay: 30000, // Start with 30s, then 2m, then 10m
        },
      }
    );

    await this.auditService.log(userId, 'SCHEDULE_JOB_CREATED', { jobId: job.id, projectId });

    return job;
  }

  async getScheduleJobs(projectId: string, userId: string) {
    await this.projectsService.getProject(projectId, userId); // verify access

    return this.prisma.scheduleJob.findMany({
      where: { projectId },
      include: {
        contentItem: true,
      },
      orderBy: { scheduledFor: 'asc' },
    });
  }

  async cancelScheduleJob(jobId: string, userId: string) {
    const job = await this.prisma.scheduleJob.findUnique({
      where: { id: jobId },
      include: {
        project: {
          include: {
            organization: {
              include: {
                memberships: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!job || job.project.organization.memberships.length === 0) {
      throw new Error('Schedule job not found');
    }

    await this.prisma.scheduleJob.update({
      where: { id: jobId },
      data: { status: 'DRAFT' },
    });

    await this.auditService.log(userId, 'SCHEDULE_JOB_CANCELLED', { jobId });

    return { success: true };
  }
}
