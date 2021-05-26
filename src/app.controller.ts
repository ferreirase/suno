import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ForbiddenException } from './exceptions/model-not-found.exception.filter';
import { AllExceptionsFilter } from './exceptions/http-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ForbiddenException {
    return this.appService.getHello();
  }

  @Get('/filter')
  getFilter(): AllExceptionsFilter {
    return this.appService.getFilter();
  }
}
