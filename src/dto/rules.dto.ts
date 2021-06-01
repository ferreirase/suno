import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import IntervalsInterface from '../interfaces/intervals.interface';
import { DaysOfWeekEnum } from '@models/rules';

export class CreateRuleByDateDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsArray()
  intervals: Array<IntervalsInterface>;
}

export class CreateRuleDailyDto {
  @IsNotEmpty()
  @IsArray()
  intervals: Array<IntervalsInterface>;
}

export class CreateRuleWeeklyDto {
  @IsNotEmpty()
  @IsArray()
  intervals: Array<IntervalsInterface>;

  @IsNotEmpty()
  @IsArray()
  days: Array<DaysOfWeekEnum | string>;
}
