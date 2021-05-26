import { Injectable } from '@nestjs/common';
import { CustomException } from './exceptions/custom-exception';

@Injectable()
export class AppService {
  getHello(): CustomException {
    throw new CustomException('Deu ruim!', 400);
  }
}
