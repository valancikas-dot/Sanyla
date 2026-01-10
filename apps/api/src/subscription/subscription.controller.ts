import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get(':organizationId')
  async getSubscription(@Param('organizationId') organizationId: string) {
    return this.subscriptionService.getSubscription(organizationId);
  }

  @Post(':organizationId/upgrade')
  async upgradePlan(
    @Param('organizationId') organizationId: string,
    @Body() body: { plan: string; billingPeriod: 'monthly' | 'yearly' },
  ) {
    return this.subscriptionService.upgradePlan(organizationId, body.plan, body.billingPeriod);
  }

  @Post(':organizationId/cancel')
  async cancelSubscription(@Param('organizationId') organizationId: string) {
    return this.subscriptionService.cancelSubscription(organizationId);
  }

  @Get(':organizationId/usage')
  async getUsageStats(@Param('organizationId') organizationId: string) {
    return this.subscriptionService.getUsageStats(organizationId);
  }
}
