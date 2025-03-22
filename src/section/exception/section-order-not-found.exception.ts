import { HttpException, HttpStatus } from '@nestjs/common';

export class SectionOrderNotFoundException extends HttpException {
    constructor(sectionOrder: number) {
        super(`Section with order '${sectionOrder}' not found`, HttpStatus.NOT_FOUND);
    }
}