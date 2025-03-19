import { Body, Controller, Post, Res } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionRequest } from './request/create-section.request';
import { Response } from 'express';

@Controller('section')
export class SectionController {
    constructor(
        private readonly sectionService: SectionService,
    ) {}


    @Post()
    async createSection(@Body() section: CreateSectionRequest, @Res() res: Response) {
        const newSection = await this.sectionService.createSection(section);

        return res.status(201).json({
            data: newSection,
        });
    }

}