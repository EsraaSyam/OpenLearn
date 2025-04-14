import { Module } from '@nestjs/common';
import { DropboxService } from './dropbox.service';
import { DropboxController } from './dropbox.controller';

@Module({
  providers: [DropboxService],
  controllers: [DropboxController],
  exports: [DropboxService],
})
export class DropboxModule {}
