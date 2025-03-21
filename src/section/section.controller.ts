import { Body, Controller, Get, Post, Put, Query, Res } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionRequest } from './request/create-section.request';
import { Response } from 'express';
import { isValidId } from 'src/validator/is-valid-id.decorator';
import { FindSectionRequest } from './request/find-sections.request';
import { UpdateSectionRequest } from './request/update-section.request';

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

    @Get(':id')
    async findSectionById(@isValidId() id: number, @Res() res: Response) {
        const section = await this.sectionService.findSectionById(id);

        return res.status(200).json({
            data: section,
        });
    }


    @Get()
    async findAllSections(@Query() prams: FindSectionRequest, @Res() res: Response) {
        const sections = await this.sectionService.findAllSections(prams);

        return res.status(200).json({
            data: sections,
        });
    }

    @Put(':id')
    async updateSection(@isValidId() id: number, @Body() section: UpdateSectionRequest, @Res() res: Response) {
        const updatedSection = await this.sectionService.updateSection(section, id);

        return res.status(200).json({
            data: updatedSection,
        });
    }
}