import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async getContentByProject(projectId: string, userId: string, type?: string) {
    await this.projectsService.getProject(projectId, userId); // verify access

    const where: any = { projectId };
    if (type) {
      where.type = type;
    }

    return this.prisma.contentItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: true,
      },
    });
  }

  async getContentItem(contentId: string, userId: string) {
    const item = await this.prisma.contentItem.findUnique({
      where: { id: contentId },
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

    if (!item || item.project.organization.memberships.length === 0) {
      throw new Error('Content item not found');
    }

    return item;
  }
}
