import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import IntervalsInterface from '../interfaces/intervals.interface';

export enum TypeRuleEnum {
  BD = 'byDate',
  DL = 'daily',
  WK = 'weekly',
}

export class RuleByDate {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(TypeRuleEnum)
  @IsNotEmpty()
  type: TypeRuleEnum;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @IsNotEmpty()
  intervals: Array<IntervalsInterface>;
}
