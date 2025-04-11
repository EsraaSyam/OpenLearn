import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DropboxService } from './dropbox.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('dropbox')
export class DropboxController {
    constructor(
        private readonly dropboxService: DropboxService,
    ) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        const url = await this.dropboxService.uploadFile(file, 'cover');
        return res.status(200).json({
            url,
        });
    }
}
