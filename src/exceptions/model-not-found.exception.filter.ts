import { Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
