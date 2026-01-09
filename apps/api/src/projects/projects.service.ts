import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit.service';
import { CreateProjectSchema, UpdateProjectSchema } from '@marketing-autopilot/shared';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getProjectsByOrg(orgId: string, userId: string) {
    // Verify user is member
    const membership = await this.prisma.membership.findFirst({
      where: { organizationId: orgId, userId },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this organization');
    }

    return this.prisma.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProject(orgId: string, userId: string, data: any) {
    const membership = await this.prisma.membership.findFirst({
      where: { organizationId: orgId, userId },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this organization');
    }

    const parsed = CreateProjectSchema.parse(data);

    const project = await this.prisma.project.create({
      data: {
        ...parsed,
        organizationId: orgId,
      },
    });

    await this.auditService.log(userId, 'PROJECT_CREATED', { projectId: project.id });

    return project;
  }

  async getProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        organization: {
          include: {
            memberships: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!project || project.organization.memberships.length === 0) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateProject(projectId: string, userId: string, data: any) {
    await this.getProject(projectId, userId); // verify access

    const parsed = UpdateProjectSchema.parse(data);

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: parsed,
    });

    await this.auditService.log(userId, 'PROJECT_UPDATED', { projectId });

    return updated;
  }

  async deleteProject(projectId: string, userId: string) {
    await this.getProject(projectId, userId); // verify access

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    await this.auditService.log(userId, 'PROJECT_DELETED', { projectId });

    return { success: true };
  }
}
