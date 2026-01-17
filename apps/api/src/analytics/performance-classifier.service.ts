import { Injectable, Logger } from '@nestjs/common';

export interface PerformanceClassification {
  status: 'UNDERPERFORMING' | 'OK';
  engagementRate: number;
  threshold: number;
}

@Injectable()
export class PerformanceClassifierService {
  private readonly logger = new Logger(PerformanceClassifierService.name);
  private readonly ENGAGEMENT_THRESHOLD = 0.01; // 1%

  /**
   * Classify post performance based on engagement rate
   * 
   * RULE: engagementRate < 1% → UNDERPERFORMING
   *       engagementRate >= 1% → OK
   */
  classify(engagementRate: number | null): PerformanceClassification {
    // If no engagement data, consider as underperforming
    if (engagementRate === null || engagementRate === undefined) {
      this.logger.warn('No engagement rate provided, treating as UNDERPERFORMING');
      return {
        status: 'UNDERPERFORMING',
        engagementRate: 0,
        threshold: this.ENGAGEMENT_THRESHOLD,
      };
    }

    const status = engagementRate < this.ENGAGEMENT_THRESHOLD ? 'UNDERPERFORMING' : 'OK';

    this.logger.debug(
      `Performance classification: ${status} (engagement: ${(engagementRate * 100).toFixed(2)}%, threshold: ${(this.ENGAGEMENT_THRESHOLD * 100).toFixed(2)}%)`
    );

    return {
      status,
      engagementRate,
      threshold: this.ENGAGEMENT_THRESHOLD,
    };
  }

  /**
   * Classify based on latest metric from schedule job
   */
  classifyFromMetrics(metrics: Array<{ engagementRate: number | null; collectedAt: Date }>): PerformanceClassification {
    if (!metrics || metrics.length === 0) {
      this.logger.warn('No metrics available for classification');
      return {
        status: 'UNDERPERFORMING',
        engagementRate: 0,
        threshold: this.ENGAGEMENT_THRESHOLD,
      };
    }

    // Get latest metric (sorted by collectedAt DESC)
    const latestMetric = metrics[0];
    return this.classify(latestMetric.engagementRate);
  }
}
