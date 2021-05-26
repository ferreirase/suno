import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomException } from './exceptions/custom-exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): CustomException {
    return this.appService.getHello();
  }
}
