import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ProjectsService } from '../projects/projects.service';
import { AuditService } from '../common/audit.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService, ProjectsService, AuditService],
  exports: [ContentService],
})
export class ContentModule {}
