import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(organizationId: string) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    // Create default FREE subscription if doesn't exist
    if (!subscription) {
      subscription = await this.prisma.subscription.create({
        data: {
          organizationId,
          plan: 'FREE',
          status: 'ACTIVE',
          maxProjects: 1,
          maxAIImages: 5,
          maxAIVideos: 0,
          maxSocialAccounts: 1,
          maxTeamMembers: 1,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        include: {
          payments: true,
        },
      });
    }

    return subscription;
  }

  async upgradePlan(organizationId: string, plan: string, billingPeriod: 'monthly' | 'yearly') {
    const subscription = await this.getSubscription(organizationId);

    // Plan limits
    const planLimits = {
      FREE: {
        maxProjects: 1,
        maxAIImages: 5,
        maxAIVideos: 0,
        maxSocialAccounts: 1,
        maxTeamMembers: 1,
        price: 0,
      },
      STARTER: {
        maxProjects: 5,
        maxAIImages: 100,
        maxAIVideos: 10,
        maxSocialAccounts: 5,
        maxTeamMembers: 2,
        price: billingPeriod === 'monthly' ? 2900 : 29000, // cents
      },
      PROFESSIONAL: {
        maxProjects: 999,
        maxAIImages: 500,
        maxAIVideos: 50,
        maxSocialAccounts: 999,
        maxTeamMembers: 3,
        price: billingPeriod === 'monthly' ? 7900 : 79000,
      },
      ENTERPRISE: {
        maxProjects: 9999,
        maxAIImages: 9999,
        maxAIVideos: 999,
        maxSocialAccounts: 9999,
        maxTeamMembers: 999,
        price: billingPeriod === 'monthly' ? 29900 : 299000,
      },
    };

    if (!planLimits[plan]) {
      throw new BadRequestException('Invalid plan');
    }

    const limits = planLimits[plan];
    const now = new Date();
    const periodEnd = new Date(
      now.getTime() + (billingPeriod === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000,
    );

    // Update subscription
    const updated = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan,
        status: 'ACTIVE',
        maxProjects: limits.maxProjects,
        maxAIImages: limits.maxAIImages,
        maxAIVideos: limits.maxAIVideos,
        maxSocialAccounts: limits.maxSocialAccounts,
        maxTeamMembers: limits.maxTeamMembers,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        usedAIImages: 0, // Reset usage
        usedAIVideos: 0,
      },
    });

    // Create payment record
    if (limits.price > 0) {
      await this.prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: limits.price,
          currency: 'EUR',
          status: 'succeeded', // Will be updated by Stripe webhook
          plan,
          billingPeriod,
          paidAt: now,
        },
      });
    }

    return updated;
  }

  async checkLimit(organizationId: string, resourceType: 'PROJECT' | 'AI_IMAGE' | 'AI_VIDEO' | 'SOCIAL_ACCOUNT') {
    const subscription = await this.getSubscription(organizationId);

    switch (resourceType) {
      case 'PROJECT': {
        const count = await this.prisma.project.count({
          where: { organizationId },
        });
        if (count >= subscription.maxProjects) {
          throw new ForbiddenException(
            `Project limit reached (${subscription.maxProjects}). Upgrade your plan.`,
          );
        }
        break;
      }

      case 'AI_IMAGE': {
        if (subscription.usedAIImages >= subscription.maxAIImages) {
          throw new ForbiddenException(
            `AI image limit reached (${subscription.maxAIImages}/month). Upgrade your plan.`,
          );
        }
        break;
      }

      case 'AI_VIDEO': {
        if (subscription.usedAIVideos >= subscription.maxAIVideos) {
          throw new ForbiddenException(
            `AI video limit reached (${subscription.maxAIVideos}/month). Upgrade your plan.`,
          );
        }
        break;
      }

      case 'SOCIAL_ACCOUNT': {
        const count = await this.prisma.socialAccount.count({
          where: { project: { organizationId } },
        });
        if (count >= subscription.maxSocialAccounts) {
          throw new ForbiddenException(
            `Social account limit reached (${subscription.maxSocialAccounts}). Upgrade your plan.`,
          );
        }
        break;
      }
    }

    return true;
  }

  async trackUsage(organizationId: string, resourceType: string, quantity = 1) {
    // Log usage
    await this.prisma.usageLog.create({
      data: {
        organizationId,
        resourceType,
        action: 'CREATE',
        quantity,
      },
    });

    // Update subscription counters
    const subscription = await this.getSubscription(organizationId);

    if (resourceType === 'AI_IMAGE') {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          usedAIImages: subscription.usedAIImages + quantity,
        },
      });
    } else if (resourceType === 'AI_VIDEO') {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          usedAIVideos: subscription.usedAIVideos + quantity,
        },
      });
    }
  }

  async cancelSubscription(organizationId: string) {
    const subscription = await this.getSubscription(organizationId);

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });
  }

  async getUsageStats(organizationId: string) {
    const subscription = await this.getSubscription(organizationId);

    const [projectCount, socialAccountCount] = await Promise.all([
      this.prisma.project.count({ where: { organizationId } }),
      this.prisma.socialAccount.count({
        where: { project: { organizationId } },
      }),
    ]);

    return {
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      usage: {
        projects: { used: projectCount, limit: subscription.maxProjects },
        aiImages: { used: subscription.usedAIImages, limit: subscription.maxAIImages },
        aiVideos: { used: subscription.usedAIVideos, limit: subscription.maxAIVideos },
        socialAccounts: { used: socialAccountCount, limit: subscription.maxSocialAccounts },
      },
    };
  }
}
