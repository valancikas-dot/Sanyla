import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get('orgs/:orgId/projects')
  async getProjects(@Param('orgId') orgId: string, @CurrentUser() user: any) {
    return this.projectsService.getProjectsByOrg(orgId, user.userId);
  }

  @Post('orgs/:orgId/projects')
  async createProject(
    @Param('orgId') orgId: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.createProject(orgId, user.userId, body);
  }

  @Get('projects/:projectId')
  async getProject(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.projectsService.getProject(projectId, user.userId);
  }

  @Patch('projects/:projectId')
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.updateProject(projectId, user.userId, body);
  }

  @Delete('projects/:projectId')
  async deleteProject(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.projectsService.deleteProject(projectId, user.userId);
  }
}
