import { Controller, Post, Param, UseGuards, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('projects/:projectId/ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('strategy')
  async generateStrategy(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.aiService.generateStrategy(projectId, user.userId);
  }

  @Post('calendar')
  async generateCalendar(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.aiService.generateCalendar(projectId, user.userId);
  }

  @Post('posts')
  async generatePosts(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.aiService.generatePosts(projectId, user.userId);
  }

  @Post('reels')
  async generateReels(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.aiService.generateReels(projectId, user.userId);
  }

  @Post('insights')
  async generateInsights(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.aiService.generateInsights(projectId, user.userId, body.analyticsData);
  }
}
