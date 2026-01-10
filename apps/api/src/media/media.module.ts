import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { DalleService } from './providers/dalle.service';
import { RunwayService } from './providers/runway.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, DalleService, RunwayService],
  exports: [MediaService],
})
export class MediaModule {}
