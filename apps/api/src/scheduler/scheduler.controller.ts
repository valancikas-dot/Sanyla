import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class SchedulerController {
  constructor(private schedulerService: SchedulerService) {}

  @Post('projects/:projectId/schedule')
  async createSchedule(
    @Param('projectId') projectId: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return this.schedulerService.createScheduleJob(projectId, user.userId, body);
  }

  @Get('projects/:projectId/schedule')
  async getSchedule(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.schedulerService.getScheduleJobs(projectId, user.userId);
  }

  @Post('schedule/:jobId/cancel')
  async cancelSchedule(@Param('jobId') jobId: string, @CurrentUser() user: any) {
    return this.schedulerService.cancelScheduleJob(jobId, user.userId);
  }
}
