import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { ScheduleProcessor } from './schedule.processor';
import { ProjectsService } from '../projects/projects.service';
import { AuditService } from '../common/audit.service';
import { MetaService } from '../social/providers/meta.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueueAsync({
      name: 'schedule',
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL');
        if (redisUrl) {
          return { connection: { url: redisUrl } };
        }
        return {
          connection: {
            host: config.get('REDIS_HOST', 'localhost'),
            port: parseInt(config.get('REDIS_PORT', '6379')),
            password: config.get('REDIS_PASSWORD'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, ScheduleProcessor, ProjectsService, AuditService, MetaService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
