import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAiService } from './openai.service';
import { ProjectsService } from '../projects/projects.service';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [AiController],
  providers: [AiService, OpenAiService, ProjectsService, AuditService],
  exports: [AiService],
})
export class AiModule {}
