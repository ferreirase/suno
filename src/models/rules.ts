import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import IntervalsInterface from '../interfaces/intervals.interface';

export enum TypeRuleEnum {
  BD = 'byDate',
  DL = 'daily',
  WK = 'weekly',
}

export enum DaysOfWeekEnum {
  MON = 'monday',
  TUE = 'tuesday',
  WED = 'wednesday',
  THU = 'thursday',
  FRI = 'friday',
}

export class Rule {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsEnum(TypeRuleEnum)
  @IsNotEmpty()
  @ApiProperty()
  type: TypeRuleEnum;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  intervals: Array<IntervalsInterface>;
}

export class RuleByDate extends Rule {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  date: string;
}

export class RuleDaily extends Rule {}

export class RuleWeekly extends Rule {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  days: Array<DaysOfWeekEnum | string>;
}
