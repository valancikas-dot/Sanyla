import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetaService } from './providers/meta.service';
import { LinkedInService } from './providers/linkedin.service';
import { TikTokService } from './providers/tiktok.service';

@Injectable()
export class SocialService {
  constructor(
    private prisma: PrismaService,
    private metaService: MetaService,
    private linkedInService: LinkedInService,
    private tiktokService: TikTokService,
  ) {}

  async connectAccount(data: {
    projectId: string;
    platform: string;
    accessToken: string;
    refreshToken?: string;
    accountId: string;
    accountName: string;
  }) {
    // Save encrypted tokens
    const account = await this.prisma.socialAccount.create({
      data: {
        projectId: data.projectId,
        platform: data.platform,
        accountId: data.accountId,
        accountName: data.accountName,
        accessToken: data.accessToken, // TODO: encrypt
        refreshToken: data.refreshToken,
        status: 'ACTIVE',
      },
    });

    return account;
  }

  async getAccounts(projectId: string) {
    return this.prisma.socialAccount.findMany({
      where: { projectId },
      select: {
        id: true,
        platform: true,
        accountId: true,
        accountName: true,
        status: true,
        metadata: true,
        createdAt: true,
      },
    });
  }

  async disconnectAccount(accountId: string) {
    return this.prisma.socialAccount.delete({
      where: { id: accountId },
    });
  }

  async publishPost(data: {
    contentItemId: string;
    socialAccountId: string;
    scheduledFor?: Date;
  }) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: data.socialAccountId },
    });

    const contentItem = await this.prisma.contentItem.findUnique({
      where: { id: data.contentItemId },
    });

    if (!account || !contentItem) {
      throw new Error('Account or content not found');
    }

    // Create publication record
    const publication = await this.prisma.publication.create({
      data: {
        contentItemId: data.contentItemId,
        socialAccountId: data.socialAccountId,
        platform: account.platform,
        scheduledFor: data.scheduledFor || new Date(),
        status: data.scheduledFor ? 'SCHEDULED' : 'PUBLISHED',
      },
    });

    // If publishing immediately
    if (!data.scheduledFor || new Date() >= data.scheduledFor) {
      try {
        let platformPostId: string;

        // Route to appropriate platform service
        switch (account.platform) {
          case 'FACEBOOK':
          case 'INSTAGRAM':
            platformPostId = await this.metaService.publishPost(
              account,
              contentItem,
            );
            break;
          case 'LINKEDIN':
            platformPostId = await this.linkedInService.publishPost(
              account,
              contentItem,
            );
            break;
          case 'TIKTOK':
            platformPostId = await this.tiktokService.publishPost(
              account,
              contentItem,
            );
            break;
          default:
            throw new Error(`Platform ${account.platform} not supported`);
        }

        // Update publication with success
        await this.prisma.publication.update({
          where: { id: publication.id },
          data: {
            status: 'PUBLISHED',
            platformPostId,
            publishedAt: new Date(),
          },
        });
      } catch (error) {
        // Update publication with error
        await this.prisma.publication.update({
          where: { id: publication.id },
          data: {
            status: 'FAILED',
            error: error.message,
          },
        });
        throw error;
      }
    }

    return publication;
  }

  async getAnalytics(accountId: string, startDate: Date, endDate: Date) {
    return this.prisma.socialAnalytics.findMany({
      where: {
        socialAccountId: accountId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async syncAnalytics(accountId: string) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Route to appropriate platform service
    switch (account.platform) {
      case 'FACEBOOK':
      case 'INSTAGRAM':
        return this.metaService.fetchAnalytics(account);
      case 'LINKEDIN':
        return this.linkedInService.fetchAnalytics(account);
      case 'TIKTOK':
        return this.tiktokService.fetchAnalytics(account);
      default:
        throw new Error(`Platform ${account.platform} not supported`);
    }
  }
}
