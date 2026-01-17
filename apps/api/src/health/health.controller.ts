import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('health')
export class HealthController {
  constructor(
    @InjectQueue('schedule') private scheduleQueue: Queue,
  ) {}

  @Get('worker')
  async workerHealth() {
    try {
      // Check if queue is accessible
      const jobCounts = await this.scheduleQueue.getJobCounts();
      const isPaused = await this.scheduleQueue.isPaused();

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        queue: {
          name: 'schedule',
          paused: isPaused,
          waiting: jobCounts.waiting,
          active: jobCounts.active,
          completed: jobCounts.completed,
          failed: jobCounts.failed,
          delayed: jobCounts.delayed,
        },
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get()
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'sanyla-api',
    };
  }
}
