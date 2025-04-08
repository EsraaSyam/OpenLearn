import { Module } from '@nestjs/common';
import { DropboxService } from './dropbox.service';
import { DropboxController } from './dropbox.controller';

@Module({
  providers: [DropboxService],
  controllers: [DropboxController]
})
export class DropboxModule {}
