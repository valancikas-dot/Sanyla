import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('projects/:projectId/content')
  async getContent(
    @Param('projectId') projectId: string,
    @Query('type') type: string,
    @CurrentUser() user: any,
  ) {
    return this.contentService.getContentByProject(projectId, user.userId, type);
  }

  @Get('content/:contentId')
  async getContentItem(@Param('contentId') contentId: string, @CurrentUser() user: any) {
    return this.contentService.getContentItem(contentId, user.userId);
  }
}
