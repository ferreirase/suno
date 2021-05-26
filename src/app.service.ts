import { Injectable } from '@nestjs/common';
import { ForbiddenException } from './exceptions/model-not-found.exception.filter';
import { AllExceptionsFilter } from './exceptions/http-exception.filter';

@Injectable()
export class AppService {
  getHello(): ForbiddenException {
    throw new ForbiddenException();
    // return 'Hello World!';
  }

  getFilter(): AllExceptionsFilter {
    throw new AllExceptionsFilter();
    // return 'Hello World!';
  }
}
