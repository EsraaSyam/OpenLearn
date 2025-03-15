import { HttpException, HttpStatus } from '@nestjs/common';

export class SectionNotFoundException extends HttpException {
    constructor(sectionId: number) {
        super(`Section with ID '${sectionId}' not found`, HttpStatus.NOT_FOUND);
    }
}
