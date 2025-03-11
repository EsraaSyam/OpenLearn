import { UnauthorizedException } from '@nestjs/common';

export class InvalidPasswordException extends UnauthorizedException {
    constructor() {
        super('Authentication failed: Incorrect password. Please try again.');
    }
}
