import { HttpException, HttpStatus } from '@nestjs/common';

export class NotValidEmailOrPasswordException extends HttpException {
  constructor() {
    super('Email or password is not valid', HttpStatus.UNAUTHORIZED);
  }
}
