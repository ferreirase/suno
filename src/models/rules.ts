import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import IntervalsInterface from '../interfaces/intervals.interface';

export enum TypeRuleEnum {
  BD = 'byDate',
  DL = 'daily',
  WK = 'weekly',
}

export class Rule {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(TypeRuleEnum)
  @IsNotEmpty()
  type: TypeRuleEnum;

  @IsArray()
  @IsNotEmpty()
  intervals: Array<IntervalsInterface>;
}

export class RuleByDate extends Rule {
  @IsString()
  @IsNotEmpty()
  date: string;
}

export class RuleDaily extends Rule {}
