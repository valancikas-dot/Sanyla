import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ProjectsService } from '../projects/projects.service';
import { AiService } from '../ai/ai.service';
import { OpenAiService } from '../ai/openai.service';
import { AuditService } from '../common/audit.service';
import { MetaInsightsService } from './meta-insights.service';
import { MetricsCollectionProcessor } from './metrics-collection.processor';
import { PerformanceClassifierService } from './performance-classifier.service';
import { AutoOptimizationProcessor } from './auto-optimization.processor';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'analytics-metrics',
    }),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    ProjectsService,
    AiService,
    OpenAiService,
    AuditService,
    MetaInsightsService,
    MetricsCollectionProcessor,
    PerformanceClassifierService,
    AutoOptimizationProcessor,
  ],
  exports: [AnalyticsService, MetaInsightsService, PerformanceClassifierService],
})
export class AnalyticsModule {}
