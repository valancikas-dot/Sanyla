import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // Connect social media account
  @Post('accounts/connect')
  async connectAccount(
    @Body() data: {
      projectId: string;
      platform: string;
      accessToken: string;
      refreshToken?: string;
      accountId: string;
      accountName: string;
    },
  ) {
    return this.socialService.connectAccount(data);
  }

  // Get connected accounts
  @Get('accounts/:projectId')
  async getAccounts(@Param('projectId') projectId: string) {
    return this.socialService.getAccounts(projectId);
  }

  // Disconnect account
  @Delete('accounts/:accountId')
  async disconnectAccount(@Param('accountId') accountId: string) {
    return this.socialService.disconnectAccount(accountId);
  }

  // Publish post to platform
  @Post('publish')
  async publishPost(
    @Body() data: {
      contentItemId: string;
      socialAccountId: string;
      scheduledFor?: Date;
    },
  ) {
    return this.socialService.publishPost(data);
  }

  // Get analytics
  @Get('analytics/:accountId')
  async getAnalytics(
    @Param('accountId') accountId: string,
    @Body() data: { startDate: Date; endDate: Date },
  ) {
    return this.socialService.getAnalytics(accountId, data.startDate, data.endDate);
  }
}
