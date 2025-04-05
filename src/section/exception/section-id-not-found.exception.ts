import { HttpException, HttpStatus } from '@nestjs/common';

export class SectionIdNotFoundException extends HttpException {
    constructor(sectionId: number) {
        super(`Section with ID '${sectionId}' not found`, HttpStatus.NOT_FOUND);
    }
}