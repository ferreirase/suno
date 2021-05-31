import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import IntervalsInterface from '../interfaces/intervals.interface';

export class CreateRuleByDateDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsArray()
  intervals: Array<IntervalsInterface>;
}
