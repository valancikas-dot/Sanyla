import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ProjectsService } from '../projects/projects.service';
import { AiService } from '../ai/ai.service';
import { OpenAiService } from '../ai/openai.service';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ProjectsService, AiService, OpenAiService, AuditService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
