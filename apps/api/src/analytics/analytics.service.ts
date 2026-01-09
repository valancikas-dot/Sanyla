import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async getAnalyticsSummary(projectId: string, userId: string) {
    await this.projectsService.getProject(projectId, userId); // verify access

    // Check for GA4 integration
    const integration = await this.prisma.integration.findFirst({
      where: { projectId, type: 'GA4' },
    });

    // MVP: Return mock data if no real integration
    if (!integration) {
      return {
        mock: true,
        message: 'No GA4 integration configured. Showing sample data.',
        period: 'Last 7 days',
        sessions: 1234,
        users: 987,
        pageviews: 4567,
        conversions: 23,
        topPages: [
          { page: '/home', views: 1200 },
          { page: '/products', views: 890 },
          { page: '/about', views: 456 },
        ],
      };
    }

    // Real GA4 integration would go here
    return {
      message: 'GA4 integration configured but not yet implemented',
      integration: integration.id,
    };
  }
}
